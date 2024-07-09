/**
 * @fileoverview Diese Datei enthält die Implementierung der AchievementsComponent-Komponente,
 * die die Liste der Errungenschaften anzeigt.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AchievementService } from "../../services/achievement.service";
import { FooterPage } from "../footer/footer.page";
import {AuthService} from "../../services/auth.service";
import {Achievement} from "../../models/achievement.model";
import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCol,
    IonContent, IonGrid, IonIcon, IonRow, IonText,
    IonTitle
} from "@ionic/angular/standalone";

/**
 * @component AchievementsComponent
 * @description Diese Komponente zeigt die Liste der Errungenschaften an.
 */
@Component({
    selector: 'app-achievements',
    templateUrl: './achievements.component.html',
    styleUrls: ['./achievements.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, FooterPage, IonTitle, IonContent, IonCol, IonCard, IonCardHeader, IonCardContent, IonRow, IonIcon, IonGrid, IonText]
})
export class AchievementsComponent implements OnInit {
    achievements: Achievement[] = [];
    /**
     * @constructor
     * @param {AchievementService} achievementService - Service für Errungenschaften.
     */
    constructor(public achievementService: AchievementService, private authService: AuthService) {
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
}
