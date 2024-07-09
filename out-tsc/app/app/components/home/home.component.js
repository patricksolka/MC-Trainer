import { __decorate } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { FooterPage } from "../footer/footer.page";
import { onAuthStateChanged } from "@angular/fire/auth";
import { ProgressBarComponent } from "../progress-bar/progress-bar.component";
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonProgressBar, IonRadio, IonRow, IonSkeletonText, IonText, IonToolbar } from "@ionic/angular/standalone";
let HomeComponent = class HomeComponent {
    //TODO: LooadingController fixen sodass er nur beim starten der App angezeigt wird
    constructor(authService, router, auth, categoryService, userService, cardService, firestore, alertController, totalStatsService) {
        this.authService = authService;
        this.router = router;
        this.auth = auth;
        this.categoryService = categoryService;
        this.userService = userService;
        this.cardService = cardService;
        this.firestore = firestore;
        this.alertController = alertController;
        this.totalStatsService = totalStatsService;
        this.userName = localStorage.getItem('userName') || 'User';
        this.categories = [];
        this.loaded = false;
        this.favCategories = [];
        //progressBar
        this.learnedMinutes = 0;
        this.totalMinutes = 30;
        this.subscription = null;
        onAuthStateChanged(this.auth, async (user) => {
            if (user) {
                console.log('User is logged in:', user.uid);
                this.user = await this.authService.getUserDetails(user.uid);
                if (this.user) {
                    localStorage.setItem('userName', this.user.firstName);
                    console.log('Loaded user details:', this.user);
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
            console.log('Benutzer', this.user);
            this.userService.getFavCategories(this.user.uid).subscribe({
                next: (favCategories) => {
                    this.favCategories = favCategories;
                    console.log('Aktualisierte Favoriten:', favCategories);
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
    //TODO: LoadingController vorerst nicht nötig
    async fetchPreview() {
        try {
            this.categories = await this.categoryService.getPreviewCategories();
        }
        catch (e) {
            console.error('Error fetching preview categories:', e);
        }
    }
    async removeFav(category) {
        if (this.user) {
            await this.userService.deleteAlert(this.user.uid, category.id);
        }
    }
    //als observable
    async fetchProgress() {
        this.loaded = false;
        //const currentUser = this.authService.auth.currentUser;
        if (this.user) {
            this.cardService.getLearningSession(this.user.uid).subscribe(learningSessions => {
                //calculate learning Duration
                //round to nearest minute
                this.learnedMinutes = Math.round(learningSessions.reduce((total, session) => total + session['duration'], 0));
                // this.progress = this.learnedMinutes;
                this.progress = this.calcPercentage();
                console.log('learnedMinutes', this.learnedMinutes);
                console.log('progress', this.progress);
                this.loaded = true;
            });
        }
    }
    //TODO: Wenn keine learningSessions vorhanden, dann auch keinen progress anzeigen!!
    //ProgressBar berechnen
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
    ionViewWillEnter() {
        //this.fetchPreview();
        this.loadFavs();
        this.userName = localStorage.getItem('userName') || 'User';
        console.log('IonViewWillEnter');
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