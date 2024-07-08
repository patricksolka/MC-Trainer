/**
 * @fileoverview Diese Datei enthält die Implementierung der StatsComponent-Komponente,
 * die die Statistiken der richtigen und falschen Antworten des Benutzers anzeigt.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from "@angular/common";
//import {TotalStatsService} from "../../services/total-stats.service";

/**
 * @constructor
 * @param {Router} router - Router zum Navigieren zwischen Seiten.
 */

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  standalone: true,
  imports: [CommonModule, IonicModule]
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
    /*const stats = this.totalStatsService.getStats();*/
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
    // Setze die Statistiken zurück und navigiere zur Startseite
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.router.navigate(['/home']);
  }
}
