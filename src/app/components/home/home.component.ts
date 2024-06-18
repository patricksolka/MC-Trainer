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
import {CardComponent} from "../card/card.component";

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
    public loadCards: CardComponent;
    private timerSubscription: Subscription;
    private categoryIndex: number = 0;
    private userId: string;
    userImg: string;
    achiImg:String

    constructor(
        private authService: AuthService,
        private router: Router,
        private loadingController: LoadingController,
        private auth: Auth,
        private categoriesService: CategoriesService,
        private userService: UserService
    ) {
        this.fetchCategories();
        this.userId = this.auth.currentUser?.uid || '';
        this.fetchFavoriteModules();
        this.userImg='assets/person-circle-outline.png';
        this.achiImg='assets/achievements.png';
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
        this.authService.logout();
        await loading.dismiss();
        await this.router.navigateByUrl('/login', {replaceUrl: true});
    }



    fetchCategories() {
        this.categoriesService.getAllCategories().subscribe((categories) => {
            this.categories = categories;
            this.initializeDisplayedCategories();
            this.fetchFavoriteModules(); // Ensure this is called after categories are loaded
        });
    }

    fetchFavoriteModules() {
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            this.userService.getFavoriteModules(currentUser.uid).then((favoriteModuleData) => {
                this.favoriteModules = this.categories.filter(category =>
                    favoriteModuleData.some(fav => fav.id === category.id)
                );

                // Sort the favoriteModules by the recently viewed timestamp
                this.favoriteModules.sort((a, b) => {
                    const aTimestamp = favoriteModuleData.find(fav => fav.id === a.id)?.timestamp || 0;
                    const bTimestamp = favoriteModuleData.find(fav => fav.id === b.id)?.timestamp || 0;
                    return bTimestamp - aTimestamp;
                });
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

    removeFavoriteModule(module: Category) {
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            this.userService.removeFavoriteModule(currentUser.uid, module.id).then(() => {
                this.favoriteModules = this.favoriteModules.filter(m => m.id !== module.id);
            });
        }
    }

    startQuiz(category: Category) {
        // Navigate to the quiz page for the selected category
        this.router.navigate(['/cards', category.id]);
    }

}