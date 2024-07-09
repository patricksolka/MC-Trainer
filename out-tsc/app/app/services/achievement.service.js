import { __decorate } from "tslib";
/**
 * @fileoverview Diese Datei enthält den AchievementService, der die Verwaltung von Errungenschaften übernimmt.
 */
import { Injectable } from '@angular/core';
import { ACHIEVEMENTS } from '../components/achievements/achievements';
import { doc, setDoc, collection, getDocs } from "@angular/fire/firestore";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../models/user.model";
/**
 * @class AchievementService
 * @description Dieser Service verwaltet die Errungenschaften des Benutzers.
 */
let AchievementService = class AchievementService {
    /**
     * @constructor
     * Initialisiert den AchievementService.
     */
    constructor(firestore, authService) {
        this.firestore = firestore;
        this.authService = authService;
        this.achieved = new Set();
        this.user = User;
        this.achievementConverter = {
            toFirestore(achievement) {
                return {
                    id: achievement.id,
                    name: achievement.name,
                    description: achievement.description,
                    condition: achievement.condition.toString(),
                    icon: achievement.icon
                };
            },
            fromFirestore(snapshot) {
                const data = snapshot.data();
                return {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    condition: eval(data.condition),
                    icon: data.icon
                };
            }
        };
        this.userCollectionRef = collection(firestore, 'users');
    }
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
    checkAchievements(stats) {
        const newAchievements = ACHIEVEMENTS.filter(achievement => achievement.condition(stats))
            .filter(achievement => !this.achieved.has(achievement.id))
            .map(achievement => {
            this.achieved.add(achievement.id);
            this.setAchievement(achievement.id);
            return achievement;
        });
        return newAchievements;
    }
    getAchieved() {
        return this.achieved;
    }
    async setAchievement(id) {
        const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/achievements/${id}`);
        const userSnap = await setDoc(userDoc, { done: true });
    }
    loadAchievements(userId) {
        const achievementsCollection = collection(this.firestore, `users/${userId}/achievements`).withConverter(this.achievementConverter);
        const achievementsDocs = getDocs(achievementsCollection);
        return from(achievementsDocs).pipe(map(querySnapshot => {
            const achievements = new Set();
            querySnapshot.forEach(doc => {
                achievements.add(parseInt(doc.id, 10));
            });
            return achievements;
        }));
    }
    /**
     * @method getAchievements
     * @description Gibt die Liste der bereits erreichten Errungenschaften zurück.
     * @returns {Array} - Eine Liste der erreichten Errungenschaften.
     */
    getAchievements() {
        return ACHIEVEMENTS.filter(achievement => this.achieved.has(achievement.id));
    }
    setAchievements() {
        const userId = this.authService.auth.currentUser.uid;
        this.loadAchievements(userId).subscribe(achievements => {
            this.achieved = achievements;
        });
    }
    ngOnInit() {
        this.setAchievements();
    }
};
AchievementService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], AchievementService);
export { AchievementService };
//# sourceMappingURL=achievement.service.js.map