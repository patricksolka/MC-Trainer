import {Component, OnInit, ViewChild} from '@angular/core';
import { TotalStatsService } from '../../services/total-stats.service';
import { CommonModule } from "@angular/common";
import {Router, RouterLink} from '@angular/router';
import {
    AlertController, IonButton, IonButtons,
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardTitle, IonCol,
    IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonProgressBar, IonRow, IonTitle, IonToolbar
} from "@ionic/angular/standalone";
import {AuthService} from "../../services/auth.service";
import {CategoryService} from "../../services/category.service";
import {Category} from "../../models/categories.model";
import {ProgressBarComponent} from "../progress-bar/progress-bar.component";
import{AchievementsComponent} from "../achievements/achievements.component";

@Component({
    selector: 'app-total-stats',
    templateUrl: './total-stats.component.html',
    styleUrls: ['./total-stats.component.scss'],
    standalone: true,
    imports: [CommonModule, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonProgressBar, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar, RouterLink, ProgressBarComponent, IonItem, IonGrid, IonRow, IonCol, AchievementsComponent]
})
export class TotalStatsComponent implements OnInit {
    categories: Category[] = [];
    totalCorrectAnswers: number
    totalIncorrectAnswers: number
    completedQuizzes: number = 0;
    completedCards: number = 0;
    percentageCorrectAnswers: number = 0;
    modules: any[] = [];

    @ViewChild(ProgressBarComponent) progressBarComponent: ProgressBarComponent;
    @ViewChild(AchievementsComponent) achievementsComponent: AchievementsComponent;

    constructor(private totalStatsService: TotalStatsService, private router: Router,
                private alertController: AlertController, private authService: AuthService, private categoryService: CategoryService) {
    }

    ngOnInit() {
        this.loadStats();
    }
    async loadStats() {
        const stats = await this.totalStatsService.calcTotalStats(this.authService.auth.currentUser.uid);
        this.totalCorrectAnswers = stats.totalCorrectAnswers;
        this.totalIncorrectAnswers = stats.totalIncorrectAnswers;
        this.completedQuizzes = stats.completedQuizzes;
        this.completedCards = stats.completedCards;
        this.percentageCorrectAnswers = (this.totalCorrectAnswers / (this.totalCorrectAnswers + this.totalIncorrectAnswers)) * 100;
    }

    backToHome() {
        this.router.navigate(['/home']);
    }
    ionViewWillEnter() {
        this.loadStats();
        if (this.progressBarComponent) {
            this.progressBarComponent.fetchProgress();
        }
    }
}
