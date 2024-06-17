import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { ACHIEVEMENTS } from '../components/achievements/achievements';
let AchievementService = class AchievementService {
    constructor() {
        this.achieved = new Set();
    }
    checkAchievements(stats) {
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
};
AchievementService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], AchievementService);
export { AchievementService };
//# sourceMappingURL=achievement.service.js.map