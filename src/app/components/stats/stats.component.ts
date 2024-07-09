/**
 * @fileoverview Diese Datei enthält die Implementierung der StatsComponent-Komponente,
 * die die Statistiken der richtigen und falschen Antworten des Benutzers anzeigt.
 */

import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterLink} from '@angular/router';
import {
    IonButton,
    IonButtons, IonCard, IonCardContent, IonCardHeader,
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar
} from "@ionic/angular/standalone";

/**
 * @constructor
 * @param {Router} router - Router zum Navigieren zwischen Seiten.
 */

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss'],
    standalone: true,
    imports: [CommonModule, IonHeader, IonToolbar, IonButton, IonButtons, IonIcon, IonTitle, RouterLink, RouterLink, IonContent, IonCard, IonCardHeader, IonCardContent]
})
export class StatsComponent implements OnInit {
    correctAnswers: number = 0;
    incorrectAnswers: number = 0;

    constructor(private router: Router) {

    }
    /**
     * @method ngOnInit
     * @description Lebenszyklus-Hook, der nach der Initialisierung der Komponente aufgerufen wird.
     * Lädt die Statistiken der richtigen und falschen Antworten aus dem Router-State.
     */
    ngOnInit() {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state as { correctAnswers: number; incorrectAnswers: number };
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
}
