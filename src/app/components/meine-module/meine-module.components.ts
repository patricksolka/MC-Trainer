import {Component, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UserService} from 'src/app/services/user.service';
import {CategoryService} from 'src/app/services/category.service';
import {Category, FavCategory} from 'src/app/models/categories.model';
import {Auth, onAuthStateChanged} from '@angular/fire/auth';

import {RouterLink} from "@angular/router";
import {FooterPage} from "../footer/footer.page";
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonRow,
    IonSearchbar,
    IonText,
    IonTitle,
    IonToolbar
} from "@ionic/angular/standalone";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";


@Component({
    selector: 'app-meine-module',
    templateUrl: './meine-module.components.html',
    styleUrls: ['./meine-module.components.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, FooterPage, IonIcon, IonItemOption, IonItemOptions, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonContent, IonList, IonItemSliding, IonHeader, IonItem, IonCard, IonText, IonSearchbar, IonLabel, IonCol, IonGrid, IonRow]
})
export class MeineModuleComponents {
    public categories: Category[] = [];
    public favCategories: FavCategory[] = [];
    public user = this.authService.auth.currentUser;

    searchBarVisible = false;
    #searchBar: IonSearchbar | undefined;
    private subscription: Subscription | null = null;

    @ViewChild(IonSearchbar)
    set searchbar(sb: IonSearchbar) {
        if (sb) {
            setTimeout(() => sb.setFocus(), 0);
            this.#searchBar = sb;
        }
    }

    constructor(
        public userService: UserService,
        public categoryService: CategoryService,
        private auth: Auth,
        private authService: AuthService
    ) {
        onAuthStateChanged(this.auth, async (user) => {
            if (user) {
                console.log('User is logged in:', user);
                await this.loadFavs();
            } else {
                console.log('User is logged out');
            }
        });
        this.loadCategories();
    }


    async loadFavs(){
        if (this.user) {
            this.userService.getFavCategories(this.user.uid).subscribe({
                next: (favCategories) => {
                    this.favCategories = favCategories;
                    console.log('Aktualisierte Favoriten:', favCategories);
                },
                error: (error) => {
                    console.error('Fehler beim Laden der Favoriten:', error);
                }
            });
        }
    }

    async loadCategories() {
        const categories = await this.categoryService.getCategories();
        if (categories) {
            this.categoryService.filterCategories();
            //this.separateCategories(categories);
        }
    }

    async addFav(categoryId: string, categoryName: string, questionCount: number) {
        if (this.user) {
            await this.userService.addFavCategory(this.user.uid, categoryId, categoryName, questionCount);
        }
    }

    async removeFav(category: Category) {
        if (this.user) {
            await this.userService.deleteAlert(this.user.uid, category.id);

        }
    }



    toggleSearch() {
        this.searchBarVisible = !this.searchBarVisible;
        if (this.searchBarVisible) {
            setTimeout(() => {
                this.#searchBar?.setFocus();
            }, 1);
        } else {
            this.categoryService.searchCategory = '';
            this.categoryService.filterCategories();
        }
    }



    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
