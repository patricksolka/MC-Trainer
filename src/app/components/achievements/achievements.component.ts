import {Component, OnInit} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {AchievementService} from "../../services/achievement.service";

@Component({
    selector: 'app-achievements',
    templateUrl: './achievements.component.html',
  //  styleUrls: ['./achievements.component.css'],
    standalone: true,
    imports: [IonicModule, CommonModule, RouterModule]
})
export class AchievementsComponent implements OnInit {
    achievements: any[] = [];

    constructor(private achievementService: AchievementService) {}

    ngOnInit() {
        this.achievements = this.achievementService.getAchievements();
    }
}
