import {Component} from '@angular/core';
import {IonicModule, LoadingController} from '@ionic/angular';
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

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [IonicModule, CommonModule, RouterModule, FormsModule, FooterPage]
})
export class HomeComponent {
    public userName: string = localStorage.getItem('userName') || 'User';
    public categories: Category[] = [];
    public displayedCategories: Category[] = [];
    public favoriteModules: Category[] = [];
    private timerSubscription: Subscription;
    private categoryIndex: number = 0;
    private userId: string;

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
        this.getUser();
        console.log(this.userName);
        this.fetchCategories();
        this.userId = this.auth.currentUser?.uid || '';
        this.fetchFavoriteModules();

    }

    ngOnDestroy() {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }

    async logout() {
        const loading = await this.loadingController.create({
            message: 'Logging out...',
        });
        await loading.present();
        await this.authService.logout();
        loading.dismiss();
        this.router.navigateByUrl('/login', {replaceUrl: true});
    }

    async getUser() {
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            await this.authService.getUserDetails(currentUser.uid).then((userDetails) => {
                if (userDetails) {
                    this.userName = `${userDetails.firstName}`;
                }
            });
        }
    }

    fetchCategories() {
        this.categoriesService.getAllCategories().subscribe((categories) => {
            this.categories = categories;
            this.initializeDisplayedCategories();
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
}