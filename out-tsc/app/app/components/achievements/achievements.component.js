import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterPage } from "../footer/footer.page";
import { IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonIcon, IonRow, IonText, IonTitle } from "@ionic/angular/standalone";
let AchievementsComponent = class AchievementsComponent {
    constructor(achievementService, authService) {
        this.achievementService = achievementService;
        this.authService = authService;
        this.achievements = [];
        this.achievementService.setAchievements();
    }
    async ngOnInit() {
        this.loadAchievements();
        this.achievementService.setAchievements();
        this.achievements = this.achievementService.getAchievements();
        console.log('Achievements', this.achievements);
    }
    loadAchievements() {
        this.achievementService.loadAchievements(this.authService.auth.currentUser.uid).subscribe(achievements => {
            console.log('Achievements loaded:', achievements);
            this.achievementService.setAchievements(); // Set achievements in the service
            this.achievements = this.achievementService.getAchievements();
            console.log('Achievements after setting:', this.achievements);
        });
    }
};
AchievementsComponent = __decorate([
    Component({
        selector: 'app-achievements',
        templateUrl: './achievements.component.html',
        styleUrls: ['./achievements.component.scss'],
        standalone: true,
        imports: [CommonModule, RouterModule, FooterPage, IonTitle, IonContent, IonCol, IonCard, IonCardHeader, IonCardContent, IonRow, IonIcon, IonGrid, IonText]
    })
], AchievementsComponent);
export { AchievementsComponent };
//# sourceMappingURL=achievements.component.js.map