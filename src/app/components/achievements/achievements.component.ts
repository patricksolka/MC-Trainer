/**
 * @fileoverview Diese Datei enthält die Implementierung der AchievementsComponent-Komponente,
 * die die Liste der Errungenschaften anzeigt.
 */

import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AchievementService } from "../../services/achievement.service";
import { FooterPage } from "../footer/footer.page";

/**
 * @component AchievementsComponent
 * @description Diese Komponente zeigt die Liste der Errungenschaften an.
 */
@Component({
    selector: 'app-achievements',
    templateUrl: './achievements.component.html',
    standalone: true,
    imports: [IonicModule, CommonModule, RouterModule, FooterPage]
})
export class AchievementsComponent implements OnInit {
    achievements: any[] = [];

    /**
     * @constructor
     * @param {AchievementService} achievementService - Service für Errungenschaften.
     */
    constructor(private achievementService: AchievementService) {}

    /**
     * @method ngOnInit
     * @description Lebenszyklus-Hook, der nach der Initialisierung der Komponente aufgerufen wird.
     * Lädt die Errungenschaften aus dem AchievementService.
     */
    ngOnInit() {
        this.achievements = this.achievementService.getAchievements();
        console.log('Achievements', this.achievements);
    }
}
