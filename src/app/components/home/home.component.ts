import {Component} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {UserService} from 'src/app/services/user.service';
import {AuthService} from 'src/app/services/auth.service';
import {FormsModule} from "@angular/forms";
import {FooterPage} from "../footer/footer.page";
import {Auth} from "@angular/fire/auth";
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from '../../models/categories.model';
import { Subscription, interval } from 'rxjs';
import {
    IonButton, IonButtons,
    IonCard,
    IonCardContent, IonCol,
    IonContent, IonGrid,
    IonIcon,
    IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonList, IonRow,
    IonText, IonToolbar
} from "@ionic/angular/standalone";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, FooterPage, IonButton, IonContent, IonIcon, IonText, IonImg, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonToolbar, IonButtons]
})
export class HomeComponent {
    public userName: string = localStorage.getItem('userName') || 'User';
    public categories: Category[] = [];
    public displayedCategories: Category[] = [];
    public favoriteModules: Category[] = [];
    private timerSubscription: Subscription;
    private categoryIndex: number = 0;
    //private userId: string;

    /*async getUserName() {
        const currentUser = this.authService.auth.currentUser;
        if (currentUser) {
            await this.userService.getUser(currentUser.uid).then((userDetails) => {
                this.userName = localStorage.getItem('userName') || 'User';
                if (userDetails) {
                    this.userName = `${userDetails.firstName}`;
                }
            });
        }
    }*/

    // userName: string = 'User';

    constructor(
        private authService: AuthService,
        private router: Router,
        private loadingController: LoadingController,
        private auth: Auth,
        private categoriesService: CategoriesService,
        private userService: UserService
    ) {
        this.fetchCategories();
        //this.userId = this.auth.currentUser?.uid || '';
        this.fetchFavoriteModules();

    }

    ngOnDestroy() {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }

   /* async logout() {
        const loading = await this.loadingController.create({
            message: 'Logging out...',
        });
        await loading.present();
        this.authService.logout();
        await loading.dismiss();
        await this.router.navigateByUrl('/login', {replaceUrl: true});
    }*/


    //TODO: Images vorerst aus assets laden; später aus DB
    /*fetchCategories() {
        this.categoriesService.getAllCategories().subscribe((categories) => {
            this.categories = categories;
            this.initializeDisplayedCategories();
            this.fetchFavoriteModules(); // Ensure this is called after categories are loaded
        });
    }*/
    fetchCategories() {
        this.categoriesService.getAllCategories().subscribe((categories) => {
            this.categories = categories.map(category => {
                let imagePath = '';
                if (category.name === 'Mathe') {
                    imagePath = 'assets/mathe.jpg';
                } else if (category.name === 'Geschichte') {
                    imagePath = 'assets/geschichte.jpg';
                } else if (category.name === 'Informatik') {
                    imagePath = 'assets/informatik.jpg';
                } else if (category.name === 'Pflanzen') {
                    imagePath = 'assets/pflanzen.jpg';
                }
                // Fügen Sie hier weitere Bedingungen für andere Kategorien hinzu
                return {
                    ...category,
                    imagePath: imagePath
                };
            });
            this.initializeDisplayedCategories();
            this.fetchFavoriteModules(); // Ensure this is called after categories are loaded
        });
    }

    fetchFavoriteModules() {
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            this.userService.getFavoriteModules(currentUser.uid).then((favoriteModuleIds) => {
                this.favoriteModules = this.categories.filter(category => favoriteModuleIds.includes(category.id));
            });
        }
    }


    initializeDisplayedCategories() {
        this.displayedCategories = this.categories.slice(0, 4);
        this.startCategoryRotation();
    }

    startCategoryRotation() {
        this.timerSubscription = interval(10000).subscribe(() => {
            this.updateDisplayedCategory();
        });
    }

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

    async loadFavoriteModules() {
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            this.userService.getFavoriteModules(currentUser.uid).then(favoriteModuleIds => {
                this.favoriteModules = this.categories.filter(category => favoriteModuleIds.includes(category.id));
            });
        }
    }

    removeFavoriteModule(module: Category) {
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            this.userService.removeFavoriteModule(currentUser.uid, module.id).then(() => {
                this.favoriteModules = this.favoriteModules.filter(m => m.id !== module.id);
            });
        }
    }

    ionViewWillEnter() {
        this.userName = localStorage.getItem('userName') || 'User';
        console.log('IonViewWillEnter');
    }


}