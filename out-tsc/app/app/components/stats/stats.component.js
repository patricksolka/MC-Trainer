/**
 * @fileoverview Diese Datei enthält die Implementierung der StatsComponent-Komponente,
 * die die Statistiken der richtigen und falschen Antworten des Benutzers anzeigt.
 */
import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from '@angular/router';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/angular/standalone";
/**
 * @constructor
 * @param {Router} router - Router zum Navigieren zwischen Seiten.
 */
let StatsComponent = class StatsComponent {
    constructor(router) {
        this.router = router;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
    }
    /**
     * @method ngOnInit
     * @description Lebenszyklus-Hook, der nach der Initialisierung der Komponente aufgerufen wird.
     * Lädt die Statistiken der richtigen und falschen Antworten aus dem Router-State.
     */
    ngOnInit() {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state;
        if (state) {
            this.correctAnswers = state.correctAnswers;
            this.incorrectAnswers = state.incorrectAnswers;
        }
    }
    /**
     * @method resetQuizHome
     * @description Setzt die Statistiken zurück und navigiert zur Startseite.
     */
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