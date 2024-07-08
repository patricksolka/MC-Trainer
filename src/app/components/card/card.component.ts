import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Card} from '../../models/card.model';
import {Category} from '../../models/categories.model';
import {CardService} from '../../services/card.service';
import {Observable, Subscription} from 'rxjs';
import {
    AlertController,
    IonButton,
    IonCard, IonCardContent,
    IonCardHeader,
    IonContent,
    IonHeader,
    IonItem,
    IonList,
    IonTitle,
    IonToolbar
} from "@ionic/angular/standalone";
import {FooterPage} from "../footer/footer.page";
import {TotalStatsService} from '../../services/total-stats.service';
import {CategoryService} from "../../services/category.service";
import {AuthService} from "../../services/auth.service";
import {Auth} from "@angular/fire/auth";
import {UserService} from "../../services/user.service";
import {Stats} from "../../models/stats.model";
import {AchievementService} from "../../services/achievement.service";
import {ToastController} from '@ionic/angular';


@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    standalone: true,
    imports: [CommonModule, IonHeader, IonContent, IonToolbar, IonTitle, IonList, IonItem, IonCard, IonCardHeader, IonCardContent, IonButton, FooterPage]
})
export class CardComponent implements OnInit, OnDestroy {
    categories$: Observable<Category[]>;
    cards$: Observable<Card[]>;
    categoryId: string;
    selectedCategoryId: string;
    currentQuestion: Card;
    showResult = false;
    selectedAnswers: string[] = [];
    correctAnswersCount = 0;
    incorrectAnswersCount = 0;
    completedQuizzes = 0;
    totalQuestions = 0;
    questions: Card[] = []; // Array für alle Fragen
    correctAnswer: boolean = false;
    public startTime: Date | null = null;

//    currentQuestionIndex: number = 0; // Neue Variable für den Index der aktuellen Frage
    private cardsSubscription: Subscription;

    constructor(private cardService: CardService,
                private route: ActivatedRoute,
                private router: Router,
                private alertController: AlertController,
                private totalStatsService: TotalStatsService,
                private categoryService: CategoryService,
                private auth: Auth,
                private userService: UserService,
                private achievementService: AchievementService,
                private toastController: ToastController,
    ) {
    }

    ngOnInit(): void {
        this.categoryId = this.route.snapshot.paramMap.get('categoryId');
        console.log('Category ID:', this.categoryId);
        this.loadCards(this.categoryId);
    }

    loadCategories(): void {
        this.categories$ = this.cardService.getCategoriesWithQuestionCounts();
    }

    async checkAllAnswered(): Promise<Card | null> {
        for (const card of this.questions) {
            const counter = await this.cardService.getCardAnsweredCounter(card.id);
            if (counter < 6) {
                return card; // Gib die Karte zurück, wenn sie noch nicht vollständig beantwortet wurde
            }
        }
        return null; // Gib null zurück, wenn alle Fragen vollständig beantwortet wurden
    }

    async answeredOnce(card: Card[]): Promise<boolean> {
        for (const card of this.questions){
            const counter = await this.cardService.getCardAnsweredCounter(card.id);
            if (counter <1){
                return false;
            }
        }
        return true;
    }



    async loadCards(categoryId: string): Promise<void> {
        this.cards$ = this.cardService.getAllCardsForCategory(categoryId);
        this.cardsSubscription = this.cards$.subscribe(
            async (cards) => {
                console.log('Geladene Karten:', cards);
                if (cards.length > 0) {
                    this.questions = this.shuffleArray(cards); // Mische die Fragen
                    this.totalQuestions = this.questions.length;
                    const question = await this.checkAllAnswered();
                    if (question) {
                        this.currentQuestion = question;
                    } else {
                        console.log("Fehler! Alle Karten wurden beantwortet!")
                    }
                    //this.currentQuestion = this.questions[0];
                } else {
                    console.warn('Keine Karten gefunden für die Kategorie mit ID:', categoryId);
                }
            },
            (error) => {
                console.error('Fehler beim Laden der Karten:', error);
            }
        );
    }

    shuffleArray(array: any[]): any[] {
        // Fisher-Yates Shuffle Algorithmus
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    selectCategory(categoryId: string): void {
        this.selectedCategoryId = categoryId;
        this.loadCards(categoryId);
    }

    toggleAnswer(answer: string): void {
        if (this.showResult) {
            return; // Wenn die Antworten überprüft wurden, keine weiteren Antworten auswählen
        }
        if (this.selectedAnswers.includes(answer)) {
            this.selectedAnswers = this.selectedAnswers.filter(a => a !== answer);
        } else {
            this.selectedAnswers.push(answer);
        }
    }

    /*async getNextQuestion(): Promise<void> {
        this.showResult = false;
        this.selectedAnswers = [];

        let index = this.questions.indexOf(this.currentQuestion);

        while (index < this.questions.length - 1) {
            index++;
            const counter = await this.cardService.getCardAnsweredCounter(this.questions[index].id);

            if (counter < 6) {
                this.currentQuestion = this.questions[index];
                console.log("Frage: " + this.currentQuestion.id);
                return;
            }
        }
        // if all questions are answered more than 6 times
        const newStats = {
            correctAnswers: this.correctAnswersCount,
            incorrectAnswers: this.incorrectAnswersCount,
            completedQuizzes: 1,
            totalQuestions: this.totalQuestions
        };

        const stats = new Stats(newStats);
        console.log('Stats:', stats);
        await this.totalStatsService.persistStats(this.auth.currentUser.uid, this.categoryId, stats);
        await this.checkForNewAchievements();

        //check if all questions are answered
        const question = await this.checkAllAnswered();
        if (!question){
            await this.cardService.setCategoryDone(this.categoryId, "done", true);
        }

        await this.endQuiz();
        await this.router.navigate(['/stats'], {
            state: {
                correctAnswers: this.correctAnswersCount,
                incorrectAnswers: this.incorrectAnswersCount,
            }
        });
    }*/
    /*async getNextQuestion(): Promise<void> {
        this.showResult = false;
        this.selectedAnswers = [];

        let index = this.questions.indexOf(this.currentQuestion);

        while (index < this.questions.length - 1) {
            index++;
            const counter = await this.cardService.getCardAnsweredCounter(this.questions[index].id);

            if (counter < 6) {
                this.currentQuestion = this.questions[index];
                console.log("Frage: " + this.currentQuestion.id);
                return;
            }
        }

        // Check if all questions are answered
        const allAnswered = await this.checkAllAnswered();
        const isQuizCompleted = allAnswered === null; // Set isQuizCompleted to true if all questions are answered

        // Update stats for the current question
        if (!isQuizCompleted) {
            if (this.correctAnswer) {
                this.correctAnswersCount++;
            } else {
                this.incorrectAnswersCount++;
            }

            // Call checkForNewAchievements with the updated stats
            const newStats = {
                completedQuizzes: this.completedQuizzes, // Removed increment here
                correctAnswers: this.correctAnswersCount,
                incorrectAnswers: this.incorrectAnswersCount,
                totalQuestions: this.totalQuestions
            };

            const stats = new Stats(newStats);
            console.log('Stats:', stats);
            await this.totalStatsService.persistStats(this.auth.currentUser.uid, this.categoryId, stats, false); // Pass false for isQuizCompleted

            console.log("Statistiken für checkForNewAchievements: ", stats);

            // Diese Methode muss asynchron aufgerufen werden, da calculateTotalStats ein Promise zurückgibt
            this.checkForNewAchievements().then(() => {
                console.log('checkForNewAchievements abgeschlossen');
            }).catch(error => {
                console.error('Fehler beim Überprüfen der Achievements:', error);
            });
        } else {
            // Quiz is completed
            this.completedQuizzes++; // Increment only when quiz is completed

            // Update stats for the completed quiz
            const newStats = {
                completedQuizzes: this.completedQuizzes,
                correctAnswers: this.correctAnswersCount,
                incorrectAnswers: this.incorrectAnswersCount,
                totalQuestions: this.totalQuestions
            };

            const stats = new Stats(newStats);
            console.log('Stats:', stats);
            await this.totalStatsService.persistStats(this.auth.currentUser.uid, this.categoryId, stats, true); // Pass true for isQuizCompleted

            console.log("Statistiken für checkForNewAchievements: ", stats);

            // Set category as done if all questions are answered
            await this.cardService.setCategoryDone(this.categoryId, "done", true);

            await this.endQuiz();
            await this.router.navigate(['/stats'], {
                state: {
                    correctAnswers: this.correctAnswersCount,
                    incorrectAnswers: this.incorrectAnswersCount,
                }
            });
        }

        // Show the result for the current question
        this.showResult = true;
    }*/

    async getNextQuestion(): Promise<void> {
        this.showResult = false;
        this.selectedAnswers = [];

        let index = this.questions.indexOf(this.currentQuestion);

        while (index < this.questions.length - 1) {
            index++;
            const counter = await this.cardService.getCardAnsweredCounter(this.questions[index].id);

            if (counter < 6) {
                this.currentQuestion = this.questions[index];
                console.log("Frage: " + this.currentQuestion.id);
                return;
            }
        }

        // If no suitable question found, check if quiz is completed
        const allAnswered = await this.answeredOnce(this.questions);
        const isQuizCompleted = allAnswered === null;

        // Show the result for the current question
        if (isQuizCompleted) {
            // Quiz ist abgeschlossen, führe entsprechende Aktionen aus

            // Erhöhe die Anzahl der abgeschlossenen Quizze
            this.completedQuizzes++;

            // Aktualisiere die Statistiken für das abgeschlossene Quiz
            const stats = new Stats({
                completedQuizzes: this.completedQuizzes,
                correctAnswers: this.correctAnswersCount,
                incorrectAnswers: this.incorrectAnswersCount,
                totalQuestions: this.totalQuestions
            });
            console.log('Stats für abgeschlossenes Quiz:', stats);

            // Persistiere die Statistiken
            await this.totalStatsService.persistStats(this.auth.currentUser.uid, this.categoryId, stats, true);

            // Markiere die Kategorie als abgeschlossen, da alle Fragen beantwortet wurden
            await this.cardService.setCategoryDone(this.categoryId, "done", true);

            // Beende das Quiz und navigiere zur Statistikseite

        } else {
            await this.endQuiz();
            await this.router.navigate(['/stats'], {
                state: {
                    correctAnswers: this.correctAnswersCount,
                    incorrectAnswers: this.incorrectAnswersCount,
                }
            });
            // Wenn das Quiz noch nicht abgeschlossen ist, zeige die letzte Frage erneut an

        }
    }


    async checkAnswers(): Promise<void> {
        // Überprüfen, ob alle ausgewählten Antworten korrekt sind
        const allSelectedCorrect = this.selectedAnswers.every(answer => this.currentQuestion.correctAnswer.includes(answer));
        // Überprüfen, ob die Anzahl der ausgewählten Antworten der Anzahl der korrekten Antworten entspricht
        const isCorrect = allSelectedCorrect && this.selectedAnswers.length === this.currentQuestion.correctAnswer.length;

        if (isCorrect) {
            console.log("correct");
            this.correctAnswersCount++;
            console.log("Aktuelle Anzahl richtiger Antworten: ", this.correctAnswersCount);
            this.correctAnswer = true;
            this.cardService.updateCardAnsweredCounter(this.currentQuestion.id, "counter");

        } else {
            console.log("not correct");
            this.correctAnswer = false;
            this.incorrectAnswersCount++;
            this.cardService.resetCardAnsweredCounter(this.currentQuestion.id, "counter");
        }

        // Update stats for the current question
        const stats = new Stats({
            completedQuizzes: this.completedQuizzes,
            correctAnswers: this.correctAnswersCount,
            incorrectAnswers: this.incorrectAnswersCount,
            totalQuestions: this.totalQuestions
        });
        console.log('Stats:', stats);
        await this.totalStatsService.persistStats(this.auth.currentUser.uid, this.categoryId, stats, false);

        console.log("Statistiken für checkForNewAchievements: ", stats);

        // Diese Methode muss asynchron aufgerufen werden, da calculateTotalStats ein Promise zurückgibt
        this.checkForNewAchievements().then(() => {
            console.log('checkForNewAchievements abgeschlossen');
        }).catch(error => {
            console.error('Fehler beim Überprüfen der Achievements:', error);
        });

        this.showResult = true;
    }










    /*checkForNewAchievements(stats) {
        const newAchievements = this.achievementService.checkAchievements(stats);
        newAchievements.forEach(achievement => {
            this.showAchievementToast(achievement);
        });
    }*/


    async checkForNewAchievements() {
        const userId = this.auth.currentUser.uid;
        const totalStats = await this.totalStatsService.calculateTotalStats(userId);

        const stats = {
            completedQuizzes: totalStats.completedQuizzes,
            correctAnswers: totalStats.totalCorrectAnswers,
            incorrectAnswers: totalStats.totalIncorrectAnswers,
            totalQuestions: totalStats.totalQuestions // Füge die Gesamtzahl der Fragen hinzu
        };

        const newAchievements = this.achievementService.checkAchievements(stats);
        newAchievements.forEach(achievement => {
            this.showAchievementToast(achievement);
        });
    }


    async showAchievementToast(achievement) {
        const toast = await this.toastController.create({
            header: 'Congratulations!',
            message: `${achievement.name}: ${achievement.description}`,
            duration: 2000, // Toast duration in milliseconds
            position: 'top', // Position of the toast
        });

        await toast.present();
    }

    /*async checkAnswers(): Promise<void> {
        // Überprüfen, ob alle ausgewählten Antworten korrekt sind
        const allSelectedCorrect = this.selectedAnswers.every(answer => this.currentQuestion.correctAnswer.includes(answer));
        // Überprüfen, ob die Anzahl der ausgewählten Antworten der Anzahl der korrekten Antworten entspricht
        const isCorrect = allSelectedCorrect && this.selectedAnswers.length === this.currentQuestion.correctAnswer.length;

        if (isCorrect) {
            console.log("correct");
            this.correctAnswersCount++;
            console.log("Aktuelle Anzahl richtiger Antworten: ", this.correctAnswersCount);
            this.correctAnswer = true;
            this.cardService.updateCardAnsweredCounter(this.currentQuestion.id, "counter");

        } else {
            console.log("not correct");
            this.correctAnswer = false;
            this.incorrectAnswersCount++;
            this.cardService.resetCardAnsweredCounter(this.currentQuestion.id, "counter");

            // this.cardService.updateCardAnsweredCounter(this.currentQuestion.id, "counterIncorrect");
        }

        // Call checkForNewAchievements with the updated stats
        const newStats = {
            completedQuizzes: this.completedQuizzes, // Removed increment here
            correctAnswers: this.correctAnswersCount,
            incorrectAnswers: this.incorrectAnswersCount,
            totalQuestions: this.totalQuestions
        };

        const stats = new Stats(newStats);
        console.log('Stats:', stats);
        this.totalStatsService.persistStats(this.auth.currentUser.uid, this.categoryId, stats, false);

        console.log("Statistiken für checkForNewAchievements: ", stats);

        // Diese Methode muss asynchron aufgerufen werden, da calculateTotalStats ein Promise zurückgibt
        this.checkForNewAchievements().then(() => {
            console.log('checkForNewAchievements abgeschlossen');
        }).catch(error => {
            console.error('Fehler beim Überprüfen der Achievements:', error);
        });

        this.showResult = true;
    }*/

   /* async checkAnswers(): Promise<void> {
        // Überprüfen, ob alle ausgewählten Antworten korrekt sind
        const allSelectedCorrect = this.selectedAnswers.every(answer => this.currentQuestion.correctAnswer.includes(answer));
        // Überprüfen, ob die Anzahl der ausgewählten Antworten der Anzahl der korrekten Antworten entspricht
        const isCorrect = allSelectedCorrect && this.selectedAnswers.length === this.currentQuestion.correctAnswer.length;

        if (isCorrect) {
            console.log("correct");
            this.correctAnswersCount++;
            console.log("Aktuelle Anzahl richtiger Antworten: ", this.correctAnswersCount);
            this.correctAnswer = true; // Setze die correctAnswer Variable auf true für diese Frage
            await this.cardService.updateCardAnsweredCounter(this.currentQuestion.id, "counter");
        } else {
            console.log("not correct");
            this.correctAnswer = false; // Setze die correctAnswer Variable auf false für diese Frage
            this.incorrectAnswersCount++;
            await this.cardService.resetCardAnsweredCounter(this.currentQuestion.id, "counter");
        }

        // Call checkForNewAchievements with the updated stats
        const stats = new Stats({
            completedQuizzes: this.completedQuizzes,
            correctAnswers: this.correctAnswersCount,
            incorrectAnswers: this.incorrectAnswersCount,
            totalQuestions: this.totalQuestions
        });
        console.log('Stats:', stats);
        await this.totalStatsService.persistStats(this.auth.currentUser.uid, this.categoryId, stats, false);

        console.log("Statistiken für checkForNewAchievements: ", stats);

        // Diese Methode muss asynchron aufgerufen werden, da calculateTotalStats ein Promise zurückgibt
        this.checkForNewAchievements().then(() => {
            console.log('checkForNewAchievements abgeschlossen');
        }).catch(error => {
            console.error('Fehler beim Überprüfen der Achievements:', error);
        });

        this.showResult = true;
    }
*/


    isCorrectAnswer(answer: string): boolean {
        return this.currentQuestion.correctAnswer.includes(answer);
        //return this.correctAnswer;
    }

    isAnswerCorrect(): boolean {
        return this.currentQuestion.correctAnswer.every((ans) =>
            this.selectedAnswers.includes(ans));
    }

    startQuiz(categoryId: string) {
        this.startTime = new Date();
        this.categoryService.startQuiz(categoryId); // Startet das Quiz
        console.log('CardComponent', this.startTime);
    }

    async endQuiz() {
        if (this.categoryService.startTime) {
            const endTime = new Date(); // Aktuelle Zeit als Endzeitpunkt

            console.log('endQuiz', this.categoryService.startTime);

            try {
                await this.cardService.addLearningSession(
                    this.auth.currentUser.uid,
                    this.categoryId,
                    this.currentQuestion.id,
                    this.categoryService.startTime, // Verwenden der Startzeit aus dem CategoryService
                    endTime // Verwenden der aktuellen Zeit als Endzeitpunkt
                );

                console.log('Learning session added successfully.', this.categoryService.startTime, endTime);
            } catch (error) {
                console.error('Error adding learning session:', error);
            }

            // Optional: Zurücksetzen der Startzeit nach der Erfassung der Lernsitzung
            this.categoryService.startTime = null;
        } else {
            console.error('Start time is not set.');
        }
    }


    ngOnDestroy(): void {
        if (this.cardsSubscription) {
            this.cardsSubscription.unsubscribe();
        }
    }
}
