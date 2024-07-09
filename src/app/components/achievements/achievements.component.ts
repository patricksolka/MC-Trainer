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

@Component({
    selector: 'app-achievements',
    templateUrl: './achievements.component.html',
    // styleUrls: ['./achievements.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, FooterPage, IonTitle, IonContent, IonCol, IonCard, IonCardHeader, IonCardContent, IonRow, IonIcon, IonGrid, IonText]
})
export class AchievementsComponent implements OnInit {
    achievements: Achievement[] = [];

    constructor(public achievementService: AchievementService, private authService: AuthService) {
        this.achievementService.setAchievements();
    }

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
