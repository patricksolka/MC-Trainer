import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from "@angular/common";
import { RouterLink } from '@angular/router';
import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/angular/standalone";
//import {TotalStatsService} from "../../services/total-stats.service";
let StatsComponent = class StatsComponent {
    constructor(router) {
        this.router = router;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
    }
    ngOnInit() {
        /*const stats = this.totalStatsService.getStats();*/
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state;
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
};
StatsComponent = __decorate([
    Component({
        selector: 'app-stats',
        templateUrl: './stats.component.html',
        styleUrls: ['./stats.component.scss'],
        standalone: true,
        imports: [CommonModule, IonicModule, IonHeader, IonToolbar, IonButton, IonButtons, IonIcon, IonTitle, RouterLink, RouterLink]
    })
], StatsComponent);
export { StatsComponent };
//# sourceMappingURL=stats.component.js.map