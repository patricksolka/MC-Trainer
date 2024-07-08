import {Component, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from "@angular/common";
import {Router, RouterLink} from '@angular/router';
import {IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar} from "@ionic/angular/standalone";

//import {TotalStatsService} from "../../services/total-stats.service";

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, IonHeader, IonToolbar, IonButton, IonButtons, IonIcon, IonTitle, RouterLink, RouterLink]
})
export class StatsComponent implements OnInit {
    correctAnswers: number = 0;
    incorrectAnswers: number = 0;

    constructor(private router: Router) {

    }

    ngOnInit() {
        /*const stats = this.totalStatsService.getStats();*/
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as { correctAnswers: number; incorrectAnswers: number };
        if (state) {
            this.correctAnswers = state.correctAnswers;
            this.incorrectAnswers = state.incorrectAnswers;
        }
    }

    resetQuizHome() {
        // Setze die Statistiken zurück und navigiere zur Startseite
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.router.navigate(['/home']);
    }
}
