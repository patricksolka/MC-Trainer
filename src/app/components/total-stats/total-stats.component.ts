/**
 * @fileoverview Diese Datei enthält die Implementierung der TotalStatsComponent-Komponente,
 * die die Gesamtstatistiken der Benutzerquizze anzeigt.
 */
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

/**
 * @component TotalStatsComponent
 * @description Diese Komponente zeigt die Gesamtstatistiken der Quiz-Ergebnisse des Benutzers an,
 * einschließlich der Anzahl richtiger und falscher Antworten sowie abgeschlossener Quizze.
 */
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
    /**
     * @constructor
     * @param {TotalStatsService} totalStatsService - Service zur Berechnung der Gesamtstatistiken.
     * @param {Router} router - Router zum Navigieren zwischen Seiten.
     * @param {AlertController} alertController - Controller für Alerts.
     * @param {AuthService} authService - Service für Authentifizierungsoperationen.
     * @param {CategoryService} categoryService - Service für Kategorieoperationen.
     */
    constructor(private totalStatsService: TotalStatsService, private router: Router, private alertController: AlertController, private authService: AuthService, private categoryService: CategoryService) {
    }

    /**
     * @method ngOnInit
     * @description Lebenszyklus-Hook, der nach der Initialisierung der Komponente aufgerufen wird.
     */
    ngOnInit() {
        this.loadStats();
    }
    /**
     * @method loadStats
     * @description Lädt die Gesamtstatistiken des Benutzers aus dem TotalStatsService.
     */
    async loadStats() {
        const stats = await this.totalStatsService.calcTotalStats(this.authService.auth.currentUser.uid);
        this.totalCorrectAnswers = stats.totalCorrectAnswers;
        this.totalIncorrectAnswers = stats.totalIncorrectAnswers;
        this.completedQuizzes = stats.completedQuizzes;
        this.completedCards = stats.completedCards;
        this.percentageCorrectAnswers = (this.totalCorrectAnswers / (this.totalCorrectAnswers + this.totalIncorrectAnswers)) * 100;
    }

    /**
     * @method ionViewWillEnter
     * @description Lebenszyklus-Hook, der aufgerufen wird, wenn die Ansicht in den Vordergrund tritt.
     */
    ionViewWillEnter() {
        this.loadStats();
        if (this.progressBarComponent) {
            this.progressBarComponent.fetchProgress();
        }
    }
}
