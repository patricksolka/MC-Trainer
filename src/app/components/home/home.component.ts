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
import {Subscription} from 'rxjs';
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
    public displayedCategories: Category[] = [];
    public favoriteModules: Category[] = [];
    public loadCards: CardComponent;
    private timerSubscription: Subscription;
    private categoryIndex: number = 0;
    public isLoading: boolean = false;


//TODO: LooadingController fixen sodass er nur beim starten der App angezeigt wird

    constructor(
        private authService: AuthService,
        private router: Router,
        private loadingController: LoadingController,
        private auth: Auth,
        public categoryService: CategoryService,
        private userService: UserService
    ) {

            this.fetchPreview();
            this.fetchFavoriteModules();
    }

    ngOnDestroy() {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }

    async fetchPreview() {
        this.isLoading = true;
        const loading = await this.loadingController.create({
        });
        await loading.present();

        try {
            this.categories = await this.categoryService.getPreviewCategories();
            await loading.dismiss();
            this.isLoading = false;
        } catch (e) {
            console.error('Error fetching preview categories:', e);
            await loading.dismiss();
            this.isLoading = false;
           /* this.categories = categories.map(category => {
                return {
                    ...category,
                    id: category.id
                };
            });*/
            // this.initializeDisplayedCategories();
            // this.fetchFavoriteModules(); // Ensure this is called after categories are loaded

        }
    }


    /*fetchCategories() {
    this.categoriesService.getAllCategories().subscribe((categories) => {
      this.categories = categories.map(category => {
        // Der imagePath wird direkt aus der Firebase-Datenbank abgerufen
        return {
          ...category,
          imagePath: category.imagePath
        };
      });
      this.initializeDisplayedCategories();
      this.fetchFavoriteModules(); // Ensure this is called after categories are loaded
    });
  }*/

    async fetchFavoriteModules() {
        this.isLoading = true;
        const loading = await this.loadingController.create({
        });
        await loading.present();

        const currentUser = this.auth.currentUser;
        if (currentUser) {
            await this.userService.getFavoriteModules(currentUser.uid).then(async (favoriteModuleData) => {
                this.categoryService.getCategories().then(async (allCategories) => {
                    this.favoriteModules = allCategories.filter(category =>
                        favoriteModuleData.some(fav => fav.id === category.id)
                    );
                    await loading.dismiss();
                    this.isLoading = false;

                });
            });
        }
    }

   /* initializeDisplayedCategories() {
        this.displayedCategories = this.categories.slice(0, 4);
        //this.startCategoryRotation();
    }*/

    /*startCategoryRotation() {
        this.timerSubscription = interval(10000).subscribe(() => {
            this.updateDisplayedCategory();
        });
    }*/

    updateDisplayedCategory() {
        if (this.categories.length > 4) {
            let nextCategory;
            do {
                nextCategory = this.categories[this.categoryIndex];
                this.categoryIndex = (this.categoryIndex + 1) % this.categories.length;
            } while (this.displayedCategories.includes(nextCategory));

            const indexToReplace = Math.floor(Math.random() * this.displayedCategories.length);
            this.displayedCategories[indexToReplace] = nextCategory;
        }
    }


    /*  async loadFavoriteModules() {
          const currentUser = this.auth.currentUser;
          if (currentUser) {
              this.userService.getFavoriteModules(currentUser.uid).then(favoriteModuleIds => {
                  this.favoriteModules = this.categories.filter(category => favoriteModuleIds.includes(category.id));
              });
          }
      }*/

    removeFavoriteModule(module: Category) {
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            this.userService.removeFavoriteModule(currentUser.uid, module.id).then(() => {
                this.favoriteModules = this.favoriteModules.filter(m => m.id !== module.id);
            });
        }
    }

    ionViewWillEnter() {
        //this.fetchFavoriteModules();
        this.userName = localStorage.getItem('userName') || 'User';
        //this.loadFavoriteModules();
        console.log('IonViewWillEnter');
    }


}