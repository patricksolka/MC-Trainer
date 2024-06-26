import {Component} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {UserService} from 'src/app/services/user.service';
import {AuthService} from 'src/app/services/auth.service';
import {FormsModule} from "@angular/forms";
import {FooterPage} from "../footer/footer.page";
import {Auth} from "@angular/fire/auth";
import {CategoryService} from 'src/app/services/category.service';
import {Category} from '../../models/categories.model';
import {Observable, Subscription} from 'rxjs';
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
    IonList,
    IonRadio,
    IonRow,
    IonText,
    IonToolbar
} from "@ionic/angular/standalone";
import {CardComponent} from "../card/card.component";



@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, FooterPage, IonButton, IonContent, IonIcon, IonText, IonImg, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonToolbar, IonButtons, IonHeader, IonLabel, IonRadio, IonCardTitle]
})
export class HomeComponent {
    public userName: string = localStorage.getItem('userName') || 'User';
    public categories: Category[] = [];
    public isLoading: boolean = false;
    public favCategories: { id: string; name: string }[] = [];



//TODO: LooadingController fixen sodass er nur beim starten der App angezeigt wird

    constructor(
        //private authService: AuthService,
        private router: Router,
        //private loadingController: LoadingController,
        private auth: Auth,
        public  categoryService: CategoryService,
        private userService: UserService,

    ) {
        this.fetchPreview();
        //this.loadFav();
        //this.fetchFavoriteModules();
    }

    /*ngOnDestroy() {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }*/
    //TODO: LoadingController vorerst nicht nötig
    async fetchPreview() {
        /*this.isLoading = true;
        const loading = await this.loadingController.create({
        });
        await loading.present();*/

        try {
            this.categories = await this.categoryService.getPreviewCategories();
            //await loading.dismiss();
            this.isLoading = false;
        } catch (e) {
            console.error('Error fetching preview categories:', e);
           // await loading.dismiss();
            this.isLoading = false;
        }
    }

    async loadFav() {
          const currentUser = this.auth.currentUser;
          if (currentUser) {

              this.favCategories = await this.userService.getFavCategories(currentUser.uid);
              console.log(this.favCategories);
          }
      }
    async removeFav(category: Category) {
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            await this.userService.removeFav(currentUser.uid, category.id).then(() => {
                this.favCategories = this.favCategories.filter(c => c.id !== category.id);
            });
        }
    }

    ionViewWillEnter() {
        this.loadFav();
        this.userName = localStorage.getItem('userName') || 'User';
        console.log('IonViewWillEnter');
    }


}