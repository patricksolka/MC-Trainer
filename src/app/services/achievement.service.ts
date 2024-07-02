import { Injectable } from '@angular/core';
import { ACHIEVEMENTS } from '../components/achievements/achievements';

@Injectable({
    providedIn: 'root',
})
export class AchievementService {
    private achieved: Set<number> = new Set();

    constructor() {}

    checkAchievements(stats: { completedQuizzes: number; correctAnswers: number, incorrectAnswers: number, totalQuestions: number }) {
        return ACHIEVEMENTS.filter(achievement => achievement.condition(stats))
            .filter(achievement => !this.achieved.has(achievement.id))
            .map(achievement => {
                this.achieved.add(achievement.id);
                return achievement;
            });
    }

    getAchievements() {
        return ACHIEVEMENTS.filter(achievement => this.achieved.has(achievement.id));
    }
}

