/**
 * @fileoverview Diese Datei enthält die Implementierung der AchievementsComponent-Komponente,
 * die die Liste der Errungenschaften anzeigt.
 */
import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterPage } from "../footer/footer.page";
import { IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonIcon, IonRow, IonText, IonTitle } from "@ionic/angular/standalone";
/**
 * @component AchievementsComponent
 * @description Diese Komponente zeigt die Liste der Errungenschaften an.
 */
let AchievementsComponent = class AchievementsComponent {
    /**
     * @constructor
     * @param {AchievementService} achievementService - Service für Errungenschaften.
     * @param authService
     */
    constructor(achievementService, authService) {
        this.achievementService = achievementService;
        this.authService = authService;
        this.achievements = [];
        this.achievementService.setAchievements();
    }
    /**
     * @method ngOnInit
     * @description Lebenszyklus-Hook, der nach der Initialisierung der Komponente aufgerufen wird.
     * Lädt die Errungenschaften aus dem AchievementService.
     */
    async ngOnInit() {
        this.loadAchievements();
        this.achievementService.setAchievements();
        this.achievements = this.achievementService.getAchievements();
    }
    loadAchievements() {
        this.achievementService.loadAchievements(this.authService.auth.currentUser.uid).subscribe(achievements => {
            console.log('Achievements loaded:', achievements);
            this.achievementService.setAchievements(); // Set achievements in the service
            this.achievements = this.achievementService.getAchievements();
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