import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from '@angular/router';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/angular/standalone";
let StatsComponent = class StatsComponent {
    constructor(router) {
        this.router = router;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
    }
    ngOnInit() {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state;
        if (state) {
            this.correctAnswers = state.correctAnswers;
            this.incorrectAnswers = state.incorrectAnswers;
        }
    }
    resetQuizHome() {
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
        imports: [CommonModule, IonHeader, IonToolbar, IonButton, IonButtons, IonIcon, IonTitle, RouterLink, RouterLink, IonContent, IonCard, IonCardHeader, IonCardContent]
    })
], StatsComponent);
export { StatsComponent };
//# sourceMappingURL=stats.component.js.map