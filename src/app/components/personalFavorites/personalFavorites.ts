/**
 * @fileoverview Diese Datei enthält die Implementierung der PersonalFavorites-Komponente,
 * die die bevorzugten Kategorien des Benutzers anzeigt und ermöglicht, Kategorien hinzuzufügen oder zu entfernen.
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UserService} from 'src/app/services/user.service';
import {CategoryService} from 'src/app/services/category.service';
import {Category, FavCategory} from 'src/app/models/categories.model';
import {Auth, onAuthStateChanged} from '@angular/fire/auth';
import {RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {FooterPage} from "../footer/footer.page";
import {
    IonBackButton, IonButton,
    IonButtons, IonCard, IonCol, IonContent, IonGrid, IonHeader,
    IonIcon, IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonRow,
    IonSearchbar, IonSkeletonText,
    IonText,
    IonTitle,
    IonToolbar
} from "@ionic/angular/standalone";
import {Subscription} from "rxjs";
import {User} from "../../models/user.model";
import {TotalStatsService} from "../../services/total-stats.service";

/**
 * @component PersonalFavorites
 * @description Diese Komponente zeigt die bevorzugten Kategorien des Benutzers an und ermöglicht es,
 * Kategorien zu durchsuchen, hinzuzufügen und zu entfernen.
 */

@Component({
    selector: 'app-personalFavorites',
    templateUrl: './personalFavorites.html',
    styleUrls: ['./personalFavorites.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, FooterPage, IonIcon, IonItemOption, IonItemOptions, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton, IonContent, IonList, IonItemSliding, IonHeader, IonItem, IonCard, IonText, IonSearchbar, IonLabel, IonCol, IonGrid, IonRow, IonSkeletonText]
})
export class PersonalFavorites implements OnInit{
    public categories: Category[] = [];
    public favCategories: FavCategory[] = [];
    public user: User;
    public completedCards: number;
    public loaded: boolean = false;

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

    /**
     * @constructor
     * @param {UserService} userService - Service für Benutzeroperationen.
     * @param {CategoryService} categoryService - Service für Kategorieoperationen.
     * @param {AuthService} authService - Service für Authentifizierungsoperationen.
     * @param {Auth} auth - Firebase Auth-Instanz.
     * @param totalStatsService
     */
    constructor(
        public userService: UserService,
        public categoryService: CategoryService,
        private auth: Auth,
        private authService: AuthService,
        private totalStatsService: TotalStatsService
    ) {
        onAuthStateChanged(this.auth, async (user) => {
            if (user) {
                console.log('User is logged in:', user.uid);
                this.user = await this.authService.getUserDetails(user.uid);
                if (this.user) {
                    localStorage.setItem('userName', this.user.firstName);
                    console.log('Loaded user details:', this.user);
                    await this.loadFavs();
                }
            } else {
                console.log('User is logged out');
            }
        });
    }

    ngOnInit() {
        this.loadCategories();
        this.loadFavs();
        const stats = this.totalStatsService.getStats(this.authService.auth.currentUser.uid, "categoryId"); // Replace "categoryId" with your actual category ID
        if (stats) {
            console.log("Stats for current user and category:", stats);
        } else {
            console.log("No stats found for current user and category");
        }
    }

    async loadFavs() {
        if (this.user) {
            this.userService.getFavCategories(this.user.uid).subscribe({
                next: (favCategories) => {
                    this.favCategories = favCategories;
                    console.log('Aktualisierte Favoriten:', favCategories);
                    for (const favCategory of this.favCategories) {
                        this.loadCompletedCards(favCategory.id);

                    }
                    this.loaded = true;
                },
                error: (error) => {
                    console.error('Fehler beim Laden der Favoriten:', error);
                    this.loaded = true;
                }
            });
        }
    }

    async loadCompletedCards(categoryId: string) {
        const favCategories = this.favCategories.find(cat => cat.id === categoryId);
        if (favCategories) {
            try {
                const stats = await this.totalStatsService.getStatsById(this.user.uid, categoryId);
                if (stats) {
                    favCategories.completedCards = stats.completedCards || 0;
                } else {
                    favCategories.completedCards = 0;
                }
            } catch (error) {
                console.error(`Fehler beim Laden der abgeschlossenen Karten für Kategorie ${categoryId}:`, error);
                favCategories.completedCards = 0;
            }
        } else {
            console.error(`Favoritenkategorie mit der ID ${categoryId} nicht gefunden.`);
        }
    }
    /**
     * @method addFav
     * @description Fügt eine Kategorie zu den bevorzugten Kategorien des Benutzers hinzu.
     * @param {string} categoryId - ID der Kategorie.
     * @param {string} categoryName - Name der Kategorie.
     * @param {number} questionCount - Anzahl der Fragen in der Kategorie.
     */
    async addFav(categoryId: string, categoryName: string, questionCount: number) {

        if (this.user) {
            this.loaded = false;
            await this.userService.addFavCategory(this.user.uid, categoryId, categoryName, questionCount);
            await this.loadFavs();
            await this.loadCompletedCards(categoryId);
            this.loaded = true;
        }
    }
    /**
     * @method loadCategories
     * @description Lädt alle Kategorien und filtert die bevorzugten Kategorien heraus.
     */
    async loadCategories() {
        const categories = await this.categoryService.getCategories();
        if (categories) {
            this.categoryService.filterCategories();

        }
    }
    /**
     * @method removeFav
     * @description Entfernt eine Kategorie aus den bevorzugten Kategorien des Benutzers.
     * @param {Category} category - Kategorie, die entfernt werden soll.
     */
    async removeFav(category: Category) {
        if (this.user) {
            await this.userService.deleteAlert(this.user.uid, category.id);

        }
    }

    /**
     * @method toggleSearch
     * @description Schaltet die Sichtbarkeit der Suchleiste um.
     */
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

    /**
     * @method ngOnDestroy
     * @description Lebenszyklus-Hook, der bei der Zerstörung der Komponente aufgerufen wird und
     * die Beobachtung der bevorzugten Kategorien beendet.
     */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
