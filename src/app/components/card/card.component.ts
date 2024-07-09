/**
 * @fileoverview Diese Datei enthält die Implementierung der CardComponent-Komponente,
 * die die Fragen einer ausgewählten Kategorie anzeigt und es dem Benutzer ermöglicht, diese zu beantworten.
 */
import { Category } from '../../models/categories.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { Card } from '../../models/card.model';
import { CardService } from '../../services/card.service';
import { CategoryService } from '../../services/category.service';
import { Observable, Subscription } from 'rxjs';
import {
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
import { Stats } from "../../models/stats.model";
import {TotalStatsService} from '../../services/total-stats.service';

/**
 * @component CardComponent
 * @description Diese Komponente zeigt die Fragen einer ausgewählten Kategorie an und ermöglicht dem Benutzer, diese zu beantworten.
 */
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
    categoryName: string;
    selectedCategoryId: string;
    currentQuestion: Card;
    showResult = false;
    selectedAnswers: string[] = [];
    correctAnswersCount = 0;
    incorrectAnswersCount = 0;
    completedQuizzes = 0;
    totalQuestions = 0;
    questions: Card[] = [];
    correctAnswer: boolean = false;
    completedCards: number = 0;
    public startTime: Date | null = null;

    private cardsSubscription: Subscription;
    /**
     * @constructor
     * @param {CardService} cardService - Service für Kartenoperationen.
     * @param {ActivatedRoute} route - Aktivierte Route zum Abrufen der Routenparameter.
     * @param {Router} router - Router zum Navigieren zwischen Seiten.
     * @param {TotalStatsService} totalStatsService - Service zur Verwaltung der Gesamtstatistiken.
     * @param {CategoryService} categoryService - Service für Kategorieoperationen.
     * @param {Auth} auth - Firebase Auth-Instanz.
     */
    constructor(private cardService: CardService,
                private route: ActivatedRoute,
                private router: Router,
                private totalStatsService: TotalStatsService,
                private categoryService: CategoryService,
                private auth: Auth,
    ) {}

    /**
     * @method ngOnInit
     * @description Lebenszyklus-Hook, der nach der Initialisierung der Komponente aufgerufen wird.
     * Lädt die Karten für die ausgewählte Kategorie.
     */
    async ngOnInit(): Promise<void> {
        this.categoryId = this.route.snapshot.paramMap.get('categoryId');
        console.log('Category ID:', this.categoryId);
        if (this.categoryId) {
            const category = await this.categoryService.getCategoryById(this.categoryId);
            this.categoryName = category.name;
        }
        this.loadCards(this.categoryId);
    }

    /**
     * @method loadCategories
     * @description Lädt die Kategorien mit der Anzahl der Fragen.
     */
    loadCategories(): void {
        this.categories$ = this.cardService.getCategoriesWithQuestionCounts();
    }

    /**
     * @method checkAllAnswered
     * @description Überprüft, ob alle Fragen einer Kategorie beantwortet wurden.
     * @returns {Promise<Card | null>} - Die nächste unbeantwortete Frage oder null, wenn alle beantwortet wurden.
     */
    async checkAllAnswered(): Promise<Card | null> {
        for (const card of this.questions) {
            const counter = await this.cardService.getCardAnsweredCounter(card.id);
            if (counter < 6) {
                return card;
            }
        }
        return null;
    }

    /**
     * @method loadCards
     * @description Lädt alle Karten für eine Kategorie und mischt die Fragen.
     * @param {string} categoryId - Die ID der Kategorie.
     */
    async loadCards(categoryId: string): Promise<void> {
        this.cards$ = this.cardService.getAllCardsForCategory(categoryId);
        this.cardsSubscription = this.cards$.subscribe(
            async (cards) => {
                if (cards.length > 0) {
                    this.questions = this.shuffleArray(cards); // Mische die Fragen
                    this.totalQuestions = this.questions.length;
                    const question = await this.checkAllAnswered();
                    if (question) {
                        this.currentQuestion = question;
                        this.shuffleArray(this.currentQuestion.answers);
                    }
                } else {
                    console.warn('Keine Karten gefunden für die Kategorie mit ID:', categoryId);
                }
            },
            (error) => {
                console.error('Fehler beim Laden der Karten:', error);
            }
        );
    }

    /**
     * @method shuffleArray
     * @description Mischt ein Array mit dem Fisher-Yates Shuffle Algorithmus.
     * @param {any[]} array - Das zu mischende Array.
     * @returns {any[]} - Das gemischte Array.
     */
    shuffleArray(array: any[]): any[] {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * @method selectCategory
     * @description Wählt eine Kategorie aus und lädt die Karten für diese Kategorie.
     * @param {string} categoryId - Die ID der Kategorie.
     */
    selectCategory(categoryId: string): void {
        this.selectedCategoryId = categoryId;
        this.loadCards(categoryId);
    }

    /**
     * @method toggleAnswer
     * @description Wählt eine Antwort aus oder hebt die Auswahl auf.
     * @param {string} answer - Die Antwort, die ausgewählt oder abgewählt werden soll.
     */
    toggleAnswer(answer: string): void {
        if (this.showResult) {
            return;
        }
        if (this.selectedAnswers.includes(answer)) {
            this.selectedAnswers = this.selectedAnswers.filter(a => a !== answer);
        } else {
            this.selectedAnswers.push(answer);
        }
    }

    /**
     * @method getNextQuestion
     * @description Lädt die nächste unbeantwortete Frage.
     */
    async getNextQuestion(): Promise<void> {
        this.showResult = false;
        this.selectedAnswers = [];

        let index = this.questions.indexOf(this.currentQuestion);

        while (index < this.questions.length - 1) {
            index++;
            const counter = await this.cardService.getCardAnsweredCounter(this.questions[index].id);

            if (counter < 6) {
                this.currentQuestion = this.questions[index];
                this.shuffleArray(this.currentQuestion.answers);
                return;
            }
        }
        const newStats = {
            correctAnswers: this.correctAnswersCount,
            incorrectAnswers: this.incorrectAnswersCount,
            completedQuizzes: 1,
            completedCards: this.completedCards
        };

        const stats = new Stats(newStats);
        await this.totalStatsService.persistStats(this.auth.currentUser.uid, this.categoryId, stats);

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
    }
    /**
     * @method checkAnswers
     * @description Überprüft die ausgewählten Antworten.
     */

    async checkAnswers(): Promise<void> {
        const allSelectedCorrect = this.selectedAnswers.every(answer => this.currentQuestion.correctAnswer.includes(answer));
        const isCorrect = allSelectedCorrect && this.selectedAnswers.length === this.currentQuestion.correctAnswer.length;

        if (isCorrect) {
            this.correctAnswersCount++;
            this.correctAnswer = true;
            await this.cardService.updateCardAnsweredCounter(this.currentQuestion.id, "counter");
            await this.completeCards();
        } else {
            this.correctAnswer = false;
            this.incorrectAnswersCount++;
            await this.cardService.resetCardAnsweredCounter(this.currentQuestion.id, "counter");
        }
        this.showResult = true;
    }

    async completeCards(){
        await this.cardService.getCardAnsweredCounter(this.currentQuestion.id).then(counter => {
            if (counter >= 6) {
                this.completedCards++;
            }
        });
    }
    /**
     * @method isCorrectAnswer
     * @description Überprüft, ob eine Antwort korrekt ist.
     * @param {string} answer - Die zu überprüfende Antwort.
     * @returns {boolean} - true, wenn die Antwort korrekt ist, andernfalls false.
     */
    isCorrectAnswer(answer: string): boolean {
        return this.currentQuestion.correctAnswer.includes(answer);
    }

    /**
     * @method isAnswerCorrect
     * @description Überprüft, ob alle ausgewählten Antworten korrekt sind.
     * @returns {boolean} - true, wenn alle ausgewählten Antworten korrekt sind, andernfalls false.
     */
    isAnswerCorrect(): boolean {
        return this.currentQuestion.correctAnswer.every((ans) =>
            this.selectedAnswers.includes(ans));
    }
    /**
     * @method startQuiz
     * @description Startet das Quiz und setzt die Startzeit.
     * @param {string} categoryId - Die ID der Kategorie.
     */
    startQuiz(categoryId: string) {
        this.startTime = new Date();
        this.categoryService.startQuiz(categoryId);
    }

    /**
     * @method endQuiz
     * @description Beendet das Quiz und speichert die Lernsitzung.
     */
    async endQuiz() {
        if (this.categoryService.startTime) {
            const endTime = new Date(); // Aktuelle Zeit als Endzeitpunkt

            console.log('endQuiz', this.categoryService.startTime);

            try {
                await this.cardService.addLearningSession(
                    this.auth.currentUser.uid,
                    this.categoryId,
                    this.currentQuestion.id,
                    this.categoryService.startTime,
                    endTime
                );
            } catch (error) {
                console.error('Error adding learning session:', error);
            }
            this.categoryService.startTime = null;
        } else {
            console.error('Start time is not set.');
        }
    }

    /**
     * @method ngOnDestroy
     * @description Lebenszyklus-Hook, der bei der Zerstörung der Komponente aufgerufen wird.
     */
    ngOnDestroy(): void {
        if (this.cardsSubscription) {
            this.cardsSubscription.unsubscribe();
        }
    }
}
