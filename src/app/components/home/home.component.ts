import {Component, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {UserService} from 'src/app/services/user.service';
import {FormsModule} from "@angular/forms";
import {FooterPage} from "../footer/footer.page";
import {Auth, onAuthStateChanged} from "@angular/fire/auth";
import {CategoryService} from 'src/app/services/category.service';
import {Category} from '../../models/categories.model';
import {ProgressBarComponent} from "../progress-bar/progress-bar.component";
import {
    AlertController,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList, IonProgressBar,
    IonRadio,
    IonRow, IonSkeletonText,
    IonText,
    IonToolbar
} from "@ionic/angular/standalone";
import {CardService} from "../../services/card.service";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user.model";


import {collection, Firestore, onSnapshot, Unsubscribe} from "@angular/fire/firestore";
import {TotalStatsService} from "../../services/total-stats.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, FooterPage, IonButton, IonContent, IonIcon, IonText, IonImg, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonToolbar, IonButtons, IonHeader, IonLabel, IonRadio, IonCardTitle, IonSkeletonText, IonProgressBar, ProgressBarComponent]
})
export class HomeComponent  {
    public userName: string = localStorage.getItem('userName') || 'User';
    public user : User;

    public categories: Category[] = [];
    public loaded: boolean = false;
    public favCategories: { id: string; name: string, questionCount: number, completedCards?: number }[] = [];

    //progressBar
    public learnedMinutes: number = 0;
    public totalMinutes: number = 30;
    public progress: number ;

    private subscription: Subscription | null = null;

    @ViewChild(ProgressBarComponent) progressBarComponent: ProgressBarComponent;

//TODO: LooadingController fixen sodass er nur beim starten der App angezeigt wird
    constructor(
        private authService: AuthService,
        private router: Router,
        private auth: Auth,
        public  categoryService: CategoryService,
        private userService: UserService,
        private cardService: CardService,
        private firestore: Firestore,
        private alertController: AlertController,
        private totalStatsService: TotalStatsService

    ) {
        onAuthStateChanged(this.auth, async (user) => {
            if (user) {
                console.log('User is logged in:', user.uid);
                this.user = await this.authService.getUserDetails(user.uid);
                if (this.user) {
                    localStorage.setItem('userName', this.user.firstName);
                    console.log('Loaded user details:', this.user);
                    await this.fetchProgress();
                    await this.fetchPreview();
                    await this.loadFavs();
                }
            } else {
                console.log('User is logged out');
            }
        });
    }

    async loadFavs(){
        if (this.user) {
            console.log('Benutzer',this.user)
            this.userService.getFavCategories(this.user.uid).subscribe({
                next: (favCategories) => {
                    this.favCategories = favCategories;
                    console.log('Aktualisierte Favoriten:', favCategories);
                    for (const favCategory of this.favCategories) {
                        this.loadCompletedCards(favCategory.id);

                    }
                },
                error: (error) => {
                    console.error('Fehler beim Laden der Favoriten:', error);
                }
            });
        }
    }

    async loadCompletedCards(categoryId: string) {
        const favCategory = this.favCategories.find(cat => cat.id === categoryId);
        if (favCategory) {
            try {
                const stats = await this.totalStatsService.getStatsById(this.user.uid, categoryId);
                if (stats) {
                    favCategory.completedCards = stats.completedCards || 0;
                } else {
                    favCategory.completedCards = 0;
                }
            } catch (error) {
                console.error(`Fehler beim Laden der abgeschlossenen Karten für Kategorie ${categoryId}:`, error);
                favCategory.completedCards = 0;
            }
        } else {
            console.error(`Favoritenkategorie mit der ID ${categoryId} nicht gefunden.`);
        }
    }

    //TODO: LoadingController vorerst nicht nötig
    async fetchPreview() {
        try {
            this.categories = await this.categoryService.getPreviewCategories();
        } catch (e) {
            console.error('Error fetching preview categories:', e);
        }
    }

    async removeFav(category: Category) {
        if (this.user) {
            await this.userService.deleteAlert(this.user.uid, category.id);

        }
    }

    //als observable
    async fetchProgress(){
        this.loaded = false;
        //const currentUser = this.authService.auth.currentUser;
        if (this.user) {
            this.cardService.getLearningSession(this.user.uid).subscribe(learningSessions => {
                //calculate learning Duration
                //round to nearest minute
                this.learnedMinutes = Math.round(learningSessions.reduce((total, session) =>
                    total + session['duration'], 0 ));
                // this.progress = this.learnedMinutes;
                this.progress = this.calcPercentage();
                console.log('learnedMinutes', this.learnedMinutes);
                console.log('progress', this.progress);
                this.loaded = true;
            });
        }
    }

    //TODO: Wenn keine learningSessions vorhanden, dann auch keinen progress anzeigen!!
    //ProgressBar berechnen
    calcPercentage() {
        const displayedMinutes = Math.max(this.learnedMinutes, 1);
        const progressPercentage = (displayedMinutes / this.totalMinutes) * 100;
        return Math.min(progressPercentage, 100); // Begrenze den Wert auf maximal 100%
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    ionViewWillEnter() {
        //this.fetchPreview();
        //this.loadFavs();
        this.userName = localStorage.getItem('userName') || 'User';
        console.log('IonViewWillEnter');
        if (this.progressBarComponent) {
            this.progressBarComponent.fetchProgress();
        }
    }

}