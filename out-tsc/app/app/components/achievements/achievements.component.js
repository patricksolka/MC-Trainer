import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterPage } from "../footer/footer.page";
let AchievementsComponent = class AchievementsComponent {
    constructor(achievementService) {
        this.achievementService = achievementService;
        this.achievements = [];
    }
    ngOnInit() {
        this.achievements = this.achievementService.getAchievements();
        console.log('Achievements', this.achievements);
    }
};
AchievementsComponent = __decorate([
    Component({
        selector: 'app-achievements',
        templateUrl: './achievements.component.html',
        standalone: true,
        imports: [IonicModule, CommonModule, RouterModule, FooterPage]
    })
], AchievementsComponent);
export { AchievementsComponent };
//# sourceMappingURL=achievements.component.js.map