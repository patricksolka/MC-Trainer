// card.component.ts
import { Category } from '../../models/categories.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { Card } from '../../models/card.model';
import { CardService } from '../../services/card.service';
import { CategoryService } from '../../services/category.service';
import { Observable, Subscription } from 'rxjs';
import {
    AlertController,
    IonButton, IonButtons,
    IonCard, IonCardContent,
    IonCardHeader,
    IonContent,
    IonHeader, IonIcon,
    IonItem,
    IonList,
    IonTitle,
    IonToolbar
} from "@ionic/angular/standalone";
import { FooterPage } from "../footer/footer.page";
import { Auth } from "@angular/fire/auth";
import {AuthService} from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { Stats } from "../../models/stats.model";
import { AchievementService } from "../../services/achievement.service";
import { ToastController } from '@ionic/angular';
import {TotalStatsService} from '../../services/total-stats.service';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    standalone: true,
    imports: [CommonModule, IonHeader, IonContent, IonToolbar, IonTitle, IonList, IonItem, IonCard, IonCardHeader, IonCardContent, IonButton, FooterPage, IonIcon, RouterLink, IonButtons]
})
export class CardComponent implements OnInit, OnDestroy {
    categories$: Observable<Category[]>;
    cards$: Observable<Card[]>;
    categoryId: string;
    categoryName: string; // Neue Variable für den Kategorie-Namen
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

    private cardsSubscription: Subscription;

    constructor(private cardService: CardService, private route: ActivatedRoute, private router: Router,
                private alertController: AlertController,
                private totalStatsService: TotalStatsService,
                private categoryService: CategoryService,
                private auth: Auth,
                private userService: UserService,
                private achievementService: AchievementService,
                private toastController: ToastController
    ) {
    }

    async ngOnInit(): Promise<void> {
        this.categoryId = this.route.snapshot.paramMap.get('categoryId');
        console.log('Category ID:', this.categoryId);
        if (this.categoryId) {
            const category = await this.categoryService.getCategoryById(this.categoryId);
            this.categoryName = category.name; // Kategorie-Namen speichern
        }
        this.loadCards(this.categoryId);
    }

    loadCategories(): void {
        this.categories$ = this.cardService.getCategoriesWithQuestionCounts();
    }

    async checkAllAnswered(): Promise<Card | null> {
        for (const card of this.questions) {
            const counter = await this.cardService.getCardAnsweredCounter(card.id);
            if (counter < 6) {
                return card;
            }
        }
        return null;
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

        // Wenn alle verbleibenden Fragen mehr als 6 Mal beantwortet wurden
        const question = await this.checkAllAnswered();
        if (!question) {
            await this.cardService.setCategoryDone(this.categoryId, "done", true);
        }

        const newStats = {
            correctAnswers: this.correctAnswersCount,
            incorrectAnswers: this.incorrectAnswersCount,
            completedQuizzes: 1
        };

        const stats = new Stats(newStats);
        console.log('Stats:', stats);
        await this.totalStatsService.persistStats(this.auth.currentUser.uid, this.categoryId, stats);
        await this.endQuiz();
        await this.router.navigate(['/stats'], {
            state: {
                correctAnswers: this.correctAnswersCount,
                incorrectAnswers: this.incorrectAnswersCount,
            }
        });
    }

    checkForNewAchievements(stats) {
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

    checkAnswers(): void {
        // Überprüfen, ob alle ausgewählten Antworten korrekt sind
        const allSelectedCorrect = this.selectedAnswers.every(answer => this.currentQuestion.correctAnswer.includes(answer));
        // Überprüfen, ob die Anzahl der ausgewählten Antworten der Anzahl der korrekten Antworten entspricht
        const isCorrect = allSelectedCorrect && this.selectedAnswers.length === this.currentQuestion.correctAnswer.length;

        if (isCorrect) {
            console.log("correct");
            this.correctAnswersCount++;
            this.correctAnswer = true;
            this.cardService.updateCardAnsweredCounter(this.currentQuestion.id, "counter");

            // Call checkForNewAchievements with the updated stats
            const stats = {
                completedQuizzes: this.completedQuizzes,
                correctAnswers: this.correctAnswersCount,
                incorrectAnswers: this.incorrectAnswersCount,
                totalQuestions: this.totalQuestions
            };
            this.checkForNewAchievements(stats);
        } else {
            console.log("not correct");
            this.correctAnswer = false;
            this.incorrectAnswersCount++;
            this.cardService.resetCardAnsweredCounter(this.currentQuestion.id, "counter");

            // this.cardService.updateCardAnsweredCounter(this.currentQuestion.id, "counterIncorrect");
        }
        this.showResult = true;
    }

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
        const newStats = {
            completedQuizzes: this.completedQuizzes + 1,
            correctAnswers: this.correctAnswersCount,
            incorrectAnswers: this.incorrectAnswersCount,
            totalQuestions: this.totalQuestions
        };

        const stats = new Stats(newStats);
        console.log('Stats:', stats);
        await this.totalStatsService.persistStats(this.auth.currentUser.uid, this.categoryId, stats);
        this.checkForNewAchievements(stats); // Check for new achievements

        await this.router.navigate(['/stats'], {
            state: {
                correctAnswers: this.correctAnswersCount,
                incorrectAnswers: this.incorrectAnswersCount,
            }
        });
    }

    ngOnDestroy(): void {
        if (this.cardsSubscription) {
            this.cardsSubscription.unsubscribe();
        }
    }
}
