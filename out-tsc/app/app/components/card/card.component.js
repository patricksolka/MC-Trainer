import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonItem, IonList, IonRow } from "@ionic/angular/standalone";
import { NgForOf, NgIf, NgClass } from "@angular/common";
import { IonApp, IonRouterOutlet, IonAlert, } from "@ionic/angular/standalone";
let CardComponent = class CardComponent {
    constructor(cardService, router, achievementService, alertController) {
        this.cardService = cardService;
        this.router = router;
        this.achievementService = achievementService;
        this.alertController = alertController;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.currentQuestion = { question: '', answers: [], correctAnswer: [] }; // Ändern Sie dies zu einem Array von Strings
        this.selectedAnswers = [];
        this.isAnswerRevealed = false;
        this.showResult = false;
        this.isAnswerCorrect = false;
        this.correctAnswersCount = 0;
        this.incorrectAnswersCount = 0;
        this.totalQuestions = 0;
        this.completedQuizzes = 0;
        this.resetQuiz();
    }
    ngOnInit() {
        this.questions = this.cardService.getQuestions();
        this.currentQuestion = this.questions[this.currentQuestionIndex];
    }
    resetQuiz() {
        this.correctAnswersCount = 0;
        this.incorrectAnswersCount = 0;
        this.currentQuestionIndex = 0;
        this.selectedAnswers = [];
        this.showResult = false;
        //  this.currentQuestion = this.questions[this.currentQuestionIndex];
        this.currentQuestion = this.questions[0];
    }
    toggleAnswer(answer) {
        if (this.selectedAnswers.includes(answer)) {
            this.selectedAnswers = this.selectedAnswers.filter(a => a !== answer);
        }
        else {
            this.selectedAnswers.push(answer);
        }
    }
    async checkAnswers() {
        this.isAnswerCorrect = this.selectedAnswers.every(answer => this.currentQuestion.correctAnswer.includes(answer)) &&
            this.currentQuestion.correctAnswer.every(answer => this.selectedAnswers.includes(answer));
        this.showResult = true;
        this.addToStats();
        this.completedQuizzes++;
        const stats = {
            completedQuizzes: this.completedQuizzes,
            correctAnswers: this.correctAnswersCount,
            totalQuestions: this.totalQuestions,
        };
        const newAchievements = this.achievementService.checkAchievements(stats);
        if (newAchievements.length) {
            const alert = await this.alertController.create({
                header: 'New Achievements',
                message: `New Achievements: ${newAchievements.map(a => a.name).join(', ')}`,
                buttons: ['OK']
            });
            await alert.present();
        }
    }
    addToStats() {
        let isCorrect = true;
        // Überprüfe jede ausgewählte Antwort
        for (const selectedAnswer of this.selectedAnswers) {
            if (!this.currentQuestion.correctAnswer.includes(selectedAnswer)) {
                isCorrect = false; // Wenn eine ausgewählte Antwort nicht in den richtigen Antworten enthalten ist, ist die gesamte Antwort falsch
                break; // Beende die Schleife, da bereits eine falsche Antwort gefunden wurde
            }
        }
        // Überprüfe, ob alle richtigen Antworten ausgewählt wurden
        for (const correctAnswer of this.currentQuestion.correctAnswer) {
            if (!this.selectedAnswers.includes(correctAnswer)) {
                isCorrect = false; // Wenn nicht alle richtigen Antworten ausgewählt wurden, ist die gesamte Antwort falsch
                break; // Beende die Schleife, da nicht alle richtigen Antworten ausgewählt wurden
            }
        }
        // Erhöhe den Zähler basierend auf dem Ergebnis
        if (isCorrect) {
            this.correctAnswersCount++;
        }
        else {
            this.incorrectAnswersCount++;
        }
    }
    getNextQuestion() {
        this.showResult = false;
        this.selectedAnswers = [];
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.currentQuestion = this.questions[this.currentQuestionIndex];
        }
        else {
            // Navigiere zur Statistikseite und übergebe die Ergebnisse
            this.router.navigate(['/stats'], {
                state: {
                    correctAnswers: this.correctAnswersCount,
                    incorrectAnswers: this.incorrectAnswersCount
                }
            });
        }
    }
};
CardComponent = __decorate([
    Component({
        selector: 'app-card',
        templateUrl: './card.component.html',
        standalone: true,
        imports: [
            NgIf,
            IonAlert,
            IonApp,
            IonRouterOutlet,
            IonCard,
            IonCardHeader,
            IonCardContent,
            IonList,
            IonItem,
            IonContent,
            NgForOf,
            NgClass,
            IonButton,
            IonGrid,
            IonRow,
            IonCol
        ],
        styleUrls: ['./card.component.css']
    })
], CardComponent);
export { CardComponent };
// funktioniert:
/*
  checkAnswers() {
    this.isAnswerCorrect = this.selectedAnswers.every(answer => this.currentQuestion.correctAnswer.includes(answer)) &&
      this.currentQuestion.correctAnswer.every(answer => this.selectedAnswers.includes(answer));
    this.showResult = true;
  }

  getNextQuestion() {
      this.showResult = false;
      this.selectedAnswers = [];
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex < this.questions.length) {
        this.currentQuestion = this.questions[this.currentQuestionIndex];
      } else {
        // Navigiere zur Statistikseite und übergebe die Ergebnisse
        this.router.navigate(['/stats'], {
          state: {
            correctAnswers: this.correctAnswersCount,
            incorrectAnswers: this.incorrectAnswersCount
          }
        });
      }
    }
  }

 */
//oberes funktioniert
/*
selectAnswer(answer: string) {
  this.selectedAnswer = answer;
}

revealAnswer() {
  this.isAnswerRevealed = true;
}

getNextQuestion() {
  this.currentQuestionIndex++;
  if (this.currentQuestionIndex < this.questions.length) {
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    this.selectedAnswer = null;
    this.isAnswerRevealed = false;
  } else {
    // Alle Fragen wurden beantwortet
    console.log('Alle Fragen wurden beantwortet');
  }
}

isCorrectAnswer(answer: string): boolean {
  return answer === this.currentQuestion.correctAnswer;
}
}
*/
/*
checkAnswer(selectedAnswer: string) {
  if (selectedAnswer === this.currentQuestion.correctAnswer) {
    console.log("Richtig!");
    // Hier könntest du weitere Logik für eine richtige Antwort implementieren
  } else {
    console.log("Falsch! Die richtige Antwort ist: " + this.currentQuestion.correctAnswer);
    // Hier könntest du weitere Logik für eine falsche Antwort implementieren
  }
}

getNextQuestion() {
  this.currentQuestionIndex++;
  if (this.currentQuestionIndex < this.questions.length) {
    this.currentQuestion = this.questions[this.currentQuestionIndex];
  } else {
    // Wenn alle Fragen beantwortet wurden, könntest du hier eine entsprechende Logik implementieren
    console.log("Alle Fragen wurden beantwortet!");
  }
}
}
*/
//# sourceMappingURL=card.component.js.map