import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {CommonModule} from "@angular/common";
import { CardComponent} from "./card/card.component";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
//  styleUrls: ['./stats.component.css'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class StatsComponent implements OnInit {
  correctAnswers: number = 0;
  incorrectAnswers: number = 0;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { correctAnswers: number; incorrectAnswers: number };
    if (state) {
      this.correctAnswers = state.correctAnswers;
      this.incorrectAnswers = state.incorrectAnswers;
    }
  }

  ngOnInit() {
    // Lade die korrekten und falschen Antworten aus dem Routing-Zustand
   const state = window.history.state;
    this.correctAnswers = state && state.correctAnswers ? state.correctAnswers : 0;
    this.incorrectAnswers = state && state.incorrectAnswers ? state.incorrectAnswers : 0;
  }


  resetQuizStats() {
    // Setze die Statistiken zurück und navigiere zur Quizseite
  /*  this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    // Füge hier den Code zum Zurücksetzen des Quiz hinzu, falls nötig
    this.router.navigate(['/cards']);
   */

  }
}
