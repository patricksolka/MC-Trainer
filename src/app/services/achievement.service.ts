/**
 * @fileoverview Diese Datei enthält den AchievementService, der die Verwaltung von Errungenschaften übernimmt.
 */

import { Injectable } from '@angular/core';
import { ACHIEVEMENTS } from '../components/achievements/achievements';

/**
 * @class AchievementService
 * @description Dieser Service verwaltet die Errungenschaften des Benutzers.
 */
@Injectable({
    providedIn: 'root',
})
export class AchievementService {
    private achieved: Set<number> = new Set();

    /**
     * @constructor
     * Initialisiert den AchievementService.
     */
    constructor() {}

    /**
     * @method checkAchievements
     * @description Überprüft, ob neue Errungenschaften erreicht wurden.
     * @param {Object} stats - Die aktuellen Statistiken des Benutzers.
     * @param {number} stats.completedQuizzes - Anzahl der abgeschlossenen Quizze.
     * @param {number} stats.correctAnswers - Anzahl der richtigen Antworten.
     * @param {number} stats.incorrectAnswers - Anzahl der falschen Antworten.
     * @param {number} stats.totalQuestions - Gesamtanzahl der Fragen.
     * @returns {Array} - Eine Liste der neuen Errungenschaften, die erreicht wurden.
     */
    checkAchievements(stats: { completedQuizzes: number; correctAnswers: number, incorrectAnswers: number, totalQuestions: number }) {
        console.log('Checking achievements with stats:', stats);
        const newAchievements = ACHIEVEMENTS.filter(achievement => achievement.condition(stats))
            .filter(achievement => !this.achieved.has(achievement.id))
            .map(achievement => {
                this.achieved.add(achievement.id);
                return achievement;
            });
        console.log('New achievements:', newAchievements);
        return newAchievements;
    }

    /**
     * @method getAchievements
     * @description Gibt die Liste der bereits erreichten Errungenschaften zurück.
     * @returns {Array} - Eine Liste der erreichten Errungenschaften.
     */
    getAchievements() {
        return ACHIEVEMENTS.filter(achievement => this.achieved.has(achievement.id));
    }
}
