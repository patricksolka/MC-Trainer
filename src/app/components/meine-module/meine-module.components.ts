import {Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/categories.model';
import {Auth, onAuthStateChanged} from '@angular/fire/auth';

import {RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {FooterPage} from "../footer/footer.page";
import {
    IonBackButton, IonButton,
    IonButtons, IonCard, IonCol, IonContent, IonGrid, IonHeader,
    IonIcon, IonItem,
    IonItemOption,
    IonItemOptions, IonItemSliding, IonLabel, IonList, IonRow, IonSearchbar, IonText, IonTitle,
    IonToolbar
} from "@ionic/angular/standalone";
import {collection, Firestore, onSnapshot, Unsubscribe} from "@angular/fire/firestore";


@Component({
    selector: 'app-meine-module',
    templateUrl: './meine-module.components.html',
    styleUrls: ['./meine-module.components.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, FooterPage, IonIcon, IonItemOption, IonItemOptions, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonContent, IonList, IonItemSliding, IonHeader, IonItem, IonCard, IonText, IonSearchbar, IonLabel, IonCol, IonGrid, IonRow]
})
export class MeineModuleComponents {
    public categories: Category[] = [];
    public favCategories: { id: string; name: string, questionCount: number, isDone?: boolean, completedCards?: number}[] = [];


    searchBarVisible = false;
    #searchBar: IonSearchbar | undefined;
    private subscription: Unsubscribe | null = null;
    //public isDone: boolean;

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
        private authService: AuthService,
        private auth: Auth,
        private firestore: Firestore
    ) {
        onAuthStateChanged(this.authService.auth, (user) => {
            if (user) {
                console.log('User is logged in:', user);
                this.observeFavCategories(user.uid);
            } else {
                console.log('User is logged out');
            }
        });

    }

    observeFavCategories(uid: string) {
        const favCategoriesRef = collection(this.firestore, `users/${uid}/favoriteCategories`);
        this.subscription = onSnapshot(favCategoriesRef, (snapshot) => {
            this.favCategories = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data()['name'], questionCount: doc.data()['questionCount'], completedCards: doc.data()['completedCards'] || 0}));
            console.log(this.favCategories);
            this.loadCategories();
        });

    }

    /*async loadFav() {
        const currentUser = this.auth.currentUser;
        if (currentUser) {

            this.favCategories = await this.userService.getFavCategories(currentUser.uid);
            console.log(this.favCategories);
        }
    }*/

    /*observeFavCategories(uid: string) {
        const favCategoriesRef = collection(this.firestore, `users/${uid}/favoriteCategories`);
        this.subscription = onSnapshot(favCategoriesRef, async (snapshot) => {
            const favCategories = snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data()['name'],
                questionCount: doc.data()['questionCount'],
                isDone: false // default value
            }));

            // Update isDone status for each favorite category
            for (let category of favCategories) {
                category.isDone = await this.categoriesService.isDone(category.id);
            }

            this.favCategories = favCategories;
            this.loadCategories();
        });
    }*/



       /* async loadCategories() {
            await this.categoriesService.getCategories().then(categories => {
                this.categories = categories.filter(category =>
                    !this.favCategories.find(fav => fav.id === category.id)
                );
            });

        }*/

    async loadCategories() {
        const categories = await this.categoryService.getCategories();
        if (categories) {
            this.categoryService.filterCategories();
            //this.separateCategories(categories);
        }
    }

    async addFav(categoryId: string, categoryName: string, questionCount: number) {
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            await this.userService.addFavCategory(currentUser.uid, categoryId, categoryName, questionCount);
            //this.loadFavCategories();


            //this.categories = this.categories.filter(category => category.id !== categoryId);
        }
    }

    async removeFav(category: Category) {
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            await this.userService.deleteAlert(currentUser.uid, category.id);

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

    /*filterCategories() {
        if (this.searchTerm.trim() === '') {
            //this.updateFilteredCategories();
        } else {
            this.filteredCategories = this.categories.filter(category =>
                !this.favCategories.find(fav => fav.id === category.id) &&
                category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
    }*/

    /*ionViewWillEnter() {
        //this.loadFavCategories();
    }*/

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription();
            this.subscription = null;
        }
    }
}
