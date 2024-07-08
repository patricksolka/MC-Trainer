import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AchievementService } from "../../services/achievement.service";
import { FooterPage } from "../footer/footer.page";

@Component({
    selector: 'app-achievements',
    templateUrl: './achievements.component.html',
    standalone: true,
    imports: [IonicModule, CommonModule, RouterModule, FooterPage]
})
export class AchievementsComponent implements OnInit {
    achievements: any[] = [];

    constructor(private achievementService: AchievementService) {}

    async ngOnInit() {
        this.achievementService.setAchievements();
        this.achievements = await this.achievementService.getAchievements();
        console.log('Achievements', this.achievements);
    }
}
