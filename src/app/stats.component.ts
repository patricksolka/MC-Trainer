import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from "@angular/common";

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
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { correctAnswers: number; incorrectAnswers: number };
    if (state) {
      this.correctAnswers = state.correctAnswers;
      this.incorrectAnswers = state.incorrectAnswers;
    }
  }

  ngOnInit() {
    const state = window.history.state;
    this.correctAnswers = state && state.correctAnswers ? state.correctAnswers : 0;
    this.incorrectAnswers = state && state.incorrectAnswers ? state.incorrectAnswers : 0;
  }

  resetQuizHome() {
    // Setze die Statistiken zurück und navigiere zur Startseite
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.router.navigate(['/home']);
  }
}
