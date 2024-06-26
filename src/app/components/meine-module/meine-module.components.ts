import {Component, OnInit} from '@angular/core';
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
    IonButtons, IonCard, IonContent, IonHeader,
    IonIcon, IonItem,
    IonItemOption,
    IonItemOptions, IonItemSliding, IonList, IonText, IonTitle,
    IonToolbar
} from "@ionic/angular/standalone";
import {collection, Firestore, onSnapshot} from "@angular/fire/firestore";

@Component({
    selector: 'app-meine-module',
    templateUrl: './meine-module.components.html',
    styleUrls: ['./meine-module.components.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, FooterPage, IonIcon, IonItemOption, IonItemOptions, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonContent, IonList, IonItemSliding, IonHeader, IonItem, IonCard, IonText]
})
export class MeineModuleComponents {
    categories: Category[] = [];
    favCategories: { id: string; name: string, questionCount: number }[] = [];
    filteredCategories: Category[] = [];
    searchVisible: boolean = false;
    searchTerm: string = '';


    constructor(
        public userService: UserService,
        private categoriesService: CategoryService,
        private authService: AuthService,
        private auth: Auth,
        private firestore: Firestore
    ) {
        onAuthStateChanged(this.authService.auth, (user) => {
            if (user) {
                console.log('User is logged in:', user);
                //this.loadFavCategories();
                this.observeFavCategories(user.uid);
            } else {
                console.log('User is logged out');
            }
        });

    }

    observeFavCategories(uid: string) {
        const favCategoriesRef = collection(this.firestore, `users/${uid}/favoriteCategories`);
        onSnapshot(favCategoriesRef, (snapshot) => {
            this.favCategories = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data()['name'], questionCount: doc.data()['questionCount'] }));
            this.loadCategories();
        });
    }

        loadCategories() {
            this.categoriesService.getCategories().then(categories => {
                this.categories = categories.filter(category =>
                    !this.favCategories.find(fav => fav.id === category.id)
                );
            });
        }



    /*async loadCategories() {
        await this.categoriesService.getCategories()/!*.then(categories => {
            //this.categories = categories;
            //this.updateFilteredCategories();
            this.categories = categories.filter(category =>
                !this.favCategories.find(fav => fav.id === category.id)
            );
        });*!/
    }*/

   /* async loadFavCategories() {
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            await this.userService.getFavCategories(currentUser.uid).then(favCategories => {
                this.favCategories = favCategories; // Assign the favoriteModules
                //this.updateFilteredCategories();
            });
        }
    }*/

    async addFav(categoryId: string, categoryName: string, questionCount: number) {
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            await this.userService.addFavCategory(currentUser.uid, categoryId, categoryName, questionCount);
            //this.loadFavCategories();

            // Entfernen Sie die Kategorie aus der Liste der Kategorien
            //this.categories = this.categories.filter(category => category.id !== categoryId);
        }
    }

    async removeFav(category: Category) {
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            await this.userService.removeFavCategory(currentUser.uid, category.id).then(() => {
               // this.favCategories = this.favCategories.filter(c => c.id !== category.id);
                //this.categories.push(category);
            });
        }
    }

   /* updateFilteredCategories() {
        this.filteredCategories = this.categories.filter(category =>
            !this.favCategories.find(fav => fav.id === category.id)
        );
    }*/

    toggleSearch() {
        this.searchVisible = !this.searchVisible;
        if (!this.searchVisible) {
            this.searchTerm = '';
            this.filterCategories();
        }
    }

    filterCategories() {
        if (this.searchTerm.trim() === '') {
            //this.updateFilteredCategories();
        } else {
            this.filteredCategories = this.categories.filter(category =>
                !this.favCategories.find(fav => fav.id === category.id) &&
                category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
    }
    ionViewWillEnter() {
        //this.loadFavCategories();
    }
}
