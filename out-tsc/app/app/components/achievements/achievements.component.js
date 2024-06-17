import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
let AchievementsComponent = class AchievementsComponent {
    constructor(achievementService) {
        this.achievementService = achievementService;
        this.achievements = [];
    }
    ngOnInit() {
        this.achievements = this.achievementService.getAchievements();
    }
};
AchievementsComponent = __decorate([
    Component({
        selector: 'app-achievements',
        templateUrl: './achievements.component.html',
        //  styleUrls: ['./achievements.component.css'],
        standalone: true,
        imports: [IonicModule, CommonModule, RouterModule]
    })
], AchievementsComponent);
export { AchievementsComponent };
//# sourceMappingURL=achievements.component.js.map