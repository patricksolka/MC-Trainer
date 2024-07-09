import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonContent, IonHeader, IonIcon, IonItem, IonList, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { FooterPage } from "../footer/footer.page";
import { Stats } from "../../models/stats.model";
let CardComponent = class CardComponent {
    constructor(cardService, route, router, alertController, totalStatsService, categoryService, auth, userService, achievementService, toastController) {
        this.cardService = cardService;
        this.route = route;
        this.router = router;
        this.alertController = alertController;
        this.totalStatsService = totalStatsService;
        this.categoryService = categoryService;
        this.auth = auth;
        this.userService = userService;
        this.achievementService = achievementService;
        this.toastController = toastController;
        this.showResult = false;
        this.selectedAnswers = [];
        this.correctAnswersCount = 0;
        this.incorrectAnswersCount = 0;
        this.completedQuizzes = 0;
        this.totalQuestions = 0;
        this.questions = []; // Array für alle Fragen
        this.correctAnswer = false;
        this.completedCards = 0;
        this.startTime = null;
    }
    async ngOnInit() {
        this.categoryId = this.route.snapshot.paramMap.get('categoryId');
        console.log('Category ID:', this.categoryId);
        if (this.categoryId) {
            const category = await this.categoryService.getCategoryById(this.categoryId);
            this.categoryName = category.name; // Kategorie-Namen speichern
        }
        this.loadCards(this.categoryId);
    }
    loadCategories() {
        this.categories$ = this.cardService.getCategoriesWithQuestionCounts();
    }
    async checkAllAnswered() {
        for (const card of this.questions) {
            const counter = await this.cardService.getCardAnsweredCounter(card.id);
            if (counter < 6) {
                return card;
            }
        }
        return null;
    }
    async loadCards(categoryId) {
        this.cards$ = this.cardService.getAllCardsForCategory(categoryId);
        this.cardsSubscription = this.cards$.subscribe(async (cards) => {
            console.log('Geladene Karten:', cards);
            if (cards.length > 0) {
                this.questions = this.shuffleArray(cards); // Mische die Fragen
                this.totalQuestions = this.questions.length;
                const question = await this.checkAllAnswered();
                if (question) {
                    this.currentQuestion = question;
                    this.shuffleArray(this.currentQuestion.answers);
                }
                else {
                    console.log("Fehler! Alle Karten wurden beantwortet!");
                }
                //this.currentQuestion = this.questions[0];
            }
            else {
                console.warn('Keine Karten gefunden für die Kategorie mit ID:', categoryId);
            }
        }, (error) => {
            console.error('Fehler beim Laden der Karten:', error);
        });
    }
    shuffleArray(array) {
        // Fisher-Yates Shuffle Algorithmus
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    selectCategory(categoryId) {
        this.selectedCategoryId = categoryId;
        this.loadCards(categoryId);
    }
    toggleAnswer(answer) {
        if (this.showResult) {
            return; // Wenn die Antworten überprüft wurden, keine weiteren Antworten auswählen
        }
        if (this.selectedAnswers.includes(answer)) {
            this.selectedAnswers = this.selectedAnswers.filter(a => a !== answer);
        }
        else {
            this.selectedAnswers.push(answer);
        }
    }
    async getNextQuestion() {
        this.showResult = false;
        this.selectedAnswers = [];
        let index = this.questions.indexOf(this.currentQuestion);
        while (index < this.questions.length - 1) {
            index++;
            const counter = await this.cardService.getCardAnsweredCounter(this.questions[index].id);
            if (counter < 6) {
                this.currentQuestion = this.questions[index];
                this.shuffleArray(this.currentQuestion.answers);
                console.log("Frage: " + this.currentQuestion.id);
                return;
            }
        }
        // if all questions are answered more than 6 times
        const newStats = {
            correctAnswers: this.correctAnswersCount,
            incorrectAnswers: this.incorrectAnswersCount,
            completedQuizzes: 1,
            completedCards: this.completedCards
        };
        const stats = new Stats(newStats);
        console.log('Stats:', stats);
        await this.totalStatsService.persistStats(this.auth.currentUser.uid, this.categoryId, stats);
        //check if all questions are answered
        const question = await this.checkAllAnswered();
        if (!question) {
            await this.cardService.setCategoryDone(this.categoryId, "done", true);
        }
        await this.endQuiz();
        await this.router.navigate(['/stats'], {
            state: {
                correctAnswers: this.correctAnswersCount,
                incorrectAnswers: this.incorrectAnswersCount,
            }
        });
    }
    async checkAnswers() {
        // Überprüfen, ob alle ausgewählten Antworten korrekt sind
        const allSelectedCorrect = this.selectedAnswers.every(answer => this.currentQuestion.correctAnswer.includes(answer));
        // Überprüfen, ob die Anzahl der ausgewählten Antworten der Anzahl der korrekten Antworten entspricht
        const isCorrect = allSelectedCorrect && this.selectedAnswers.length === this.currentQuestion.correctAnswer.length;
        if (isCorrect) {
            console.log("correct");
            this.correctAnswersCount++;
            this.correctAnswer = true;
            await this.cardService.updateCardAnsweredCounter(this.currentQuestion.id, "counter");
            console.log('CardComponent', this.correctAnswersCount);
            await this.completeCards();
        }
        else {
            console.log("not correct");
            this.correctAnswer = false;
            this.incorrectAnswersCount++;
            await this.cardService.resetCardAnsweredCounter(this.currentQuestion.id, "counter");
        }
        this.showResult = true;
    }
    async completeCards() {
        await this.cardService.getCardAnsweredCounter(this.currentQuestion.id).then(counter => {
            console.log('Counter:', counter);
            if (counter >= 6) {
                this.completedCards++;
                console.log('CardComponent', this.completedCards);
                //this.totalStatsService.completedCards(this.auth.currentUser.uid,
                // this.completedCards); // Call the method to update Firestore
            }
        });
    }
    /* async updateAnswerStats() {
         const counter = await this.cardService.getCardAnsweredCounter(this.currentQuestion.id);
         console.log('Counter:', counter);
         if (counter === 1) {
             this.completedCards++;
             console.log('CardComponent', this.completedCards);
             await this.totalStatsService.completedCards(this.categoryId, this.completedCards);
         }
     }*/
    isCorrectAnswer(answer) {
        return this.currentQuestion.correctAnswer.includes(answer);
    }
    isAnswerCorrect() {
        return this.currentQuestion.correctAnswer.every((ans) => this.selectedAnswers.includes(ans));
    }
    startQuiz(categoryId) {
        this.startTime = new Date();
        this.categoryService.startQuiz(categoryId); // Startet das Quiz
        console.log('CardComponent', this.startTime);
    }
    async endQuiz() {
        if (this.categoryService.startTime) {
            const endTime = new Date(); // Aktuelle Zeit als Endzeitpunkt
            console.log('endQuiz', this.categoryService.startTime);
            try {
                await this.cardService.addLearningSession(this.auth.currentUser.uid, this.categoryId, this.currentQuestion.id, this.categoryService.startTime, // Verwenden der Startzeit aus dem CategoryService
                endTime // Verwenden der aktuellen Zeit als Endzeitpunkt
                );
                console.log('Learning session added successfully.', this.categoryService.startTime, endTime);
            }
            catch (error) {
                console.error('Error adding learning session:', error);
            }
            // Optional: Zurücksetzen der Startzeit nach der Erfassung der Lernsitzung
            this.categoryService.startTime = null;
        }
        else {
            console.error('Start time is not set.');
        }
        /*const newStats = {
            completedQuizzes: this.completedQuizzes + 1,
            correctAnswers: this.correctAnswersCount,
            incorrectAnswers: this.incorrectAnswersCount,
            totalQuestions: this.totalQuestions
        };

        const stats = new Stats(newStats);
        console.log('Stats:', stats);
        await this.totalStatsService.persistStats(this.auth.currentUser.uid, this.categoryId, stats);
        //this.checkForNewAchievements(stats); // Check for new achievements

        await this.router.navigate(['/stats'], {
            state: {
                correctAnswers: this.correctAnswersCount,
                incorrectAnswers: this.incorrectAnswersCount,
            }
        });*/
    }
    ngOnDestroy() {
        if (this.cardsSubscription) {
            this.cardsSubscription.unsubscribe();
        }
    }
};
CardComponent = __decorate([
    Component({
        selector: 'app-card',
        templateUrl: './card.component.html',
        styleUrls: ['./card.component.scss'],
        standalone: true,
        imports: [CommonModule, IonHeader, IonContent, IonToolbar, IonTitle, IonList, IonItem, IonCard, IonCardHeader, IonCardContent, IonButton, FooterPage, IonIcon, RouterLink, IonButtons]
    })
], CardComponent);
export { CardComponent };
//# sourceMappingURL=card.component.js.map