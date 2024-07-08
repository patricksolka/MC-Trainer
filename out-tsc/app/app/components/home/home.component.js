import { __decorate } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { FooterPage } from "../footer/footer.page";
import { ProgressBarComponent } from "../progress-bar/progress-bar.component";
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonProgressBar, IonRadio, IonRow, IonSkeletonText, IonText, IonToolbar } from "@ionic/angular/standalone";
import { collection, onSnapshot } from "@angular/fire/firestore";
let HomeComponent = class HomeComponent {
    //TODO: LooadingController fixen sodass er nur beim starten der App angezeigt wird
    constructor(auth, categoryService, userService, cardService, firestore) {
        this.auth = auth;
        this.categoryService = categoryService;
        this.userService = userService;
        this.cardService = cardService;
        this.firestore = firestore;
        this.userName = localStorage.getItem('userName') || 'User';
        this.categories = [];
        this.favCategories = [];
        this.subscription = null;
        this.auth.onAuthStateChanged(user => {
            if (user) {
                console.log('onAuthStateChanged changed', user.uid);
                this.userService.getUser(user.uid).then(user => {
                    localStorage.setItem('userName', user.firstName);
                });
                this.fetchPreview();
                this.observeFavCategories(user.uid);
                this.cardService.resetLearningSession(user.uid);
            }
        });
    }
    // In HomeComponent
    observeFavCategories(uid) {
        const favCategoriesRef = collection(this.firestore, `users/${uid}/favoriteCategories`);
        this.subscription = onSnapshot(favCategoriesRef, (snapshot) => {
            this.favCategories = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data()['name'], questionCount: doc.data()['questionCount'], completedCards: doc.data()['completedCards'] || 0 }));
            console.log(this.favCategories);
        });
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
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            await this.userService.deleteAlert(currentUser.uid, category.id);
        }
    }
    ionViewWillEnter() {
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