import {Component, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {UserService} from 'src/app/services/user.service';
import {FormsModule} from "@angular/forms";
import {FooterPage} from "../footer/footer.page";
import {Auth} from "@angular/fire/auth";
import {CategoryService} from 'src/app/services/category.service';
import {Category} from '../../models/categories.model';
import {ProgressBarComponent} from "../progress-bar/progress-bar.component";
import {
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
import {collection, Firestore, onSnapshot, Unsubscribe} from "@angular/fire/firestore";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, FooterPage, IonButton, IonContent, IonIcon, IonText, IonImg, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonToolbar, IonButtons, IonHeader, IonLabel, IonRadio, IonCardTitle, IonSkeletonText, IonProgressBar, ProgressBarComponent]
})
export class HomeComponent  {
    public userName: string = localStorage.getItem('userName') || 'User';
    public categories: Category[] = [];
    public favCategories: { id: string; name: string, questionCount: number, completedCards?: number }[] = [];
    private subscription: Unsubscribe | null = null;

    @ViewChild(ProgressBarComponent) progressBarComponent: ProgressBarComponent;

//TODO: LooadingController fixen sodass er nur beim starten der App angezeigt wird

    constructor(
        private auth: Auth,
        public  categoryService: CategoryService,
        private userService: UserService,
        private cardService: CardService,
        private firestore: Firestore,
    ) {
        this.auth.onAuthStateChanged(user =>{
            if (user){

                console.log('onAuthStateChanged changed', user.uid);
                this.userService.getUser(user.uid).then(user => {
                    localStorage.setItem('userName', user.firstName);
                });
                this.fetchPreview();
                this.observeFavCategories(user.uid);
                this.cardService.resetLearningSession(user.uid);
            }
        });
    }

    // In HomeComponent
    observeFavCategories(uid: string) {
        const favCategoriesRef = collection(this.firestore, `users/${uid}/favoriteCategories`);
        this.subscription = onSnapshot(favCategoriesRef, (snapshot) => {
            this.favCategories = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data()['name'], questionCount: doc.data()['questionCount'], completedCards: doc.data()['completedCards'] || 0}));
            console.log(this.favCategories);
        });

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
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            await this.userService.deleteAlert(currentUser.uid, category.id);

        }
    }

    ionViewWillEnter() {
        this.userName = localStorage.getItem('userName') || 'User';
        console.log('IonViewWillEnter');
        if (this.progressBarComponent) {
            this.progressBarComponent.fetchProgress();
        }
    }

}