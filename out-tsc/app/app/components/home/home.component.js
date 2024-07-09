import { __decorate } from "tslib";
/**
 * @fileoverview Diese Datei enthält die Implementierung der HomeComponent-Komponente,
 * die die Startseite der Anwendung darstellt und verschiedene Kategorien sowie Fortschrittsbalken anzeigt.
 */
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { FooterPage } from "../footer/footer.page";
import { onAuthStateChanged } from "@angular/fire/auth";
import { ProgressBarComponent } from "../progress-bar/progress-bar.component";
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonProgressBar, IonRadio, IonRow, IonSkeletonText, IonText, IonToolbar } from "@ionic/angular/standalone";
/**
 * @component HomeComponent
 * @description Diese Komponente stellt die Startseite der Anwendung dar, einschließlich der Anzeige von Kategorien, Fortschrittsbalken und Favoriten.
 */
let HomeComponent = class HomeComponent {
    /**
     * @constructor
     * @param authService
     * @param {Auth} auth - Firebase Auth-Instanz.
     * @param {CategoryService} categoryService - Service für Kategorieoperationen.
     * @param {UserService} userService - Service für Benutzeroperationen.
     * @param {CardService} cardService - Service für Kartenoperationen.
     * @param totalStatsService
     */
    constructor(authService, auth, categoryService, userService, cardService, totalStatsService) {
        this.authService = authService;
        this.auth = auth;
        this.categoryService = categoryService;
        this.userService = userService;
        this.cardService = cardService;
        this.totalStatsService = totalStatsService;
        this.userName = localStorage.getItem('userName') || 'User';
        this.categories = [];
        this.loaded = false;
        this.favCategories = [];
        this.learnedMinutes = 0;
        this.totalMinutes = 30;
        this.subscription = null;
        onAuthStateChanged(this.auth, async (user) => {
            if (user) {
                this.user = await this.authService.getUserDetails(user.uid);
                if (this.user) {
                    localStorage.setItem('userName', this.user.firstName);
                    await this.fetchProgress();
                    await this.fetchPreview();
                    await this.loadFavs();
                }
            }
            else {
                console.log('User is logged out');
            }
        });
    }
    async loadFavs() {
        if (this.user) {
            this.userService.getFavCategories(this.user.uid).subscribe({
                next: (favCategories) => {
                    this.favCategories = favCategories;
                    for (const favCategory of this.favCategories) {
                        this.loadCompletedHome(favCategory.id);
                    }
                },
                error: (error) => {
                    console.error('Fehler beim Laden der Favoriten:', error);
                }
            });
        }
    }
    async loadCompletedHome(categoryId) {
        const favCategory = this.favCategories.find(cat => cat.id === categoryId);
        if (favCategory) {
            try {
                const stats = await this.totalStatsService.getStatsById(this.user.uid, categoryId);
                if (stats) {
                    favCategory.completedCards = stats.completedCards || 0;
                }
                else {
                    favCategory.completedCards = 0;
                }
            }
            catch (error) {
                console.error(`Fehler beim Laden der abgeschlossenen Karten für Kategorie ${categoryId}:`, error);
                favCategory.completedCards = 0;
            }
        }
        else {
            console.error(`Favoritenkategorie mit der ID ${categoryId} nicht gefunden.`);
        }
    }
    /**
     * @method fetchPreview
     * @description Lädt die Vorschaukategorien aus dem CategoryService.
     */
    async fetchPreview() {
        try {
            this.categories = await this.categoryService.getPreviewCategories();
        }
        catch (e) {
            console.error('Error fetching preview categories:', e);
        }
    }
    /**
     * @method removeFav
     * @description Entfernt eine Kategorie aus den Favoriten des Benutzers.
     * @param {Category} category - Kategorie, die entfernt werden soll.
     */
    async removeFav(category) {
        if (this.user) {
            await this.userService.deleteAlert(this.user.uid, category.id);
        }
    }
    /**
     * @method fetchProgress
     * @description Lädt die Fortschrittsdaten des Benutzers aus dem CardService.
     */
    async fetchProgress() {
        this.loaded = false;
        if (this.user) {
            this.cardService.getLearningSession(this.user.uid).subscribe(learningSessions => {
                this.learnedMinutes = Math.round(learningSessions.reduce((total, session) => total + session['duration'], 0));
                this.progress = this.calcPercentage();
                this.loaded = true;
            });
        }
    }
    /**
     * @method calcPercentage
     * @description Berechnet den Fortschrittsprozentsatz für den Fortschrittsbalken.
     * @returns {number} - Der berechnete Fortschrittsprozentsatz.
     */
    calcPercentage() {
        const displayedMinutes = Math.max(this.learnedMinutes, 1);
        const progressPercentage = (displayedMinutes / this.totalMinutes) * 100;
        return Math.min(progressPercentage, 100); // Begrenze den Wert auf maximal 100%
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    /**
     * @method ionViewWillEnter
     * @description Lebenszyklus-Hook, der aufgerufen wird, wenn die Ansicht in den Vordergrund tritt.
     */
    ionViewWillEnter() {
        this.loadFavs();
        this.userName = localStorage.getItem('userName') || 'User';
        if (this.progressBarComponent) {
            this.progressBarComponent.fetchProgress();
        }
    }
};
__decorate([
    ViewChild(ProgressBarComponent)
], HomeComponent.prototype, "progressBarComponent", void 0);
HomeComponent = __decorate([
    Component({
        selector: 'app-home',
        templateUrl: './home.component.html',
        styleUrls: ['./home.component.scss'],
        standalone: true,
        imports: [CommonModule, RouterModule, FormsModule, FooterPage, IonButton, IonContent, IonIcon, IonText, IonImg, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonToolbar, IonButtons, IonHeader, IonLabel, IonRadio, IonCardTitle, IonSkeletonText, IonProgressBar, ProgressBarComponent]
    })
], HomeComponent);
export { HomeComponent };
//# sourceMappingURL=home.component.js.map