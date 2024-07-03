import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {UserService} from 'src/app/services/user.service';
import {FormsModule} from "@angular/forms";
import {FooterPage} from "../footer/footer.page";
import {Auth} from "@angular/fire/auth";
import {CategoryService} from 'src/app/services/category.service';
import {Category} from '../../models/categories.model';
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
    IonList,
    IonRadio,
    IonRow, IonSkeletonText,
    IonText,
    IonToolbar
} from "@ionic/angular/standalone";

import {CardService} from "../../services/card.service";


import {card} from "ionicons/icons";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;
import {collection, Firestore, onSnapshot, Unsubscribe} from "@angular/fire/firestore";



@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, FooterPage, IonButton, IonContent, IonIcon, IonText, IonImg, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonToolbar, IonButtons, IonHeader, IonLabel, IonRadio, IonCardTitle, IonSkeletonText]
})
export class HomeComponent  {
    public userName: string = localStorage.getItem('userName') || 'User';
    public categories: Category[] = [];
    public loaded: boolean = false;
    public favCategories: { id: string; name: string, questionCount: number, completedCards?: number }[] = [];

    //progressBar
    public learnedMinutes: number = 0;
    public totalMinutes: number = 30;
    public progress: number ;

    private subscription: Unsubscribe | null = null;



//TODO: LooadingController fixen sodass er nur beim starten der App angezeigt wird


    constructor(
        //private authService: AuthService,
        private router: Router,
        //private loadingController: LoadingController,
        private auth: Auth,
        public  categoryService: CategoryService,
        private userService: UserService,
        private cardService: CardService,
        private firestore: Firestore,
        private alertController: AlertController

    ) {
        this.auth.onAuthStateChanged(user =>{
            if (user){

                console.log('hfjgfjgfjjf changed', user.uid);
                this.userService.getUser(user.uid).then(user => {
                    localStorage.setItem('userName', user.firstName);
                });
                this.fetchProgress();
                this.fetchPreview();
                this.observeFavCategories(user.uid);
                this.cardService.resetLearningSession(user.uid);
                console.log('tetst' ,this.progress);
            }
        });



        //this.loadFav();
        //this.fetchFavoriteModules();
    }

    /*ngOnDestroy() {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }*/

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
        /*this.isLoading = true;
        const loading = await this.loadingController.create({
        });
        await loading.present();*/

        try {
            this.categories = await this.categoryService.getPreviewCategories();
            //await loading.dismiss();
            //this.loaded = false;
        } catch (e) {
            console.error('Error fetching preview categories:', e);
           // await loading.dismiss();
            //this.loaded = true;
        }
    }

    //für die Favoriten
    /*getProgress(category: any): number {
        const answeredQuestions = category.answeredQuestions || 0;
        const totalQuestions = category.totalQuestions || 1; // Vermeide Division durch Null
        return (answeredQuestions / totalQuestions) * 100;
    }*/

   /* async loadFav() {
          const currentUser = this.auth.currentUser;
          if (currentUser) {

              this.favCategories = await this.userService.getFavCategories(currentUser.uid);
              console.log(this.favCategories);
          }
      }*/

    async removeFav(category: Category) {
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            await this.userService.deleteAlert(currentUser.uid, category.id);

        }
    }

    //als promise
   /* async fetchProgress(){
        this.loaded = false;
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            const learningSessions: DocumentData[] = await
             this.cardService.getLearningSessions(currentUser.uid);
            //this.learnedMinutes = learningSessions.reduce((total, session) => total +
            // session['duration'], 0 );
            this.learnedMinutes = Math.floor(learningSessions.reduce((total, session) => total + Math.max(1, session['duration']), 0 ));
            console.log('learnedMinutes', this.learnedMinutes);
            this.loaded = true;
        }

    }*/

    //als observable
    async fetchProgress(){
        this.loaded = false;
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            this.cardService.getLearningSession(currentUser.uid).subscribe(learningSessions => {
                //calculate learning Duration
                //round to nearest minute
                this.learnedMinutes = Math.round(learningSessions.reduce((total, session) => total + session['duration'], 0 ));
                this.progress = this.learnedMinutes;
                console.log('learnedMinutes', this.learnedMinutes);
                console.log('progress', this.progress);
                this.loaded = true;
            });
        }
    }


    ionViewWillEnter() {
        /*this.fetchPreview();
        this.loadFav();*/
        this.userName = localStorage.getItem('userName') || 'User';
        console.log('IonViewWillEnter');
    }

}