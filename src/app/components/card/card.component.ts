import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../models/card.model';
import { Category } from '../../models/categories.model';
import { CardService } from '../../services/card.service';
import { Observable, Subscription } from 'rxjs';
import {
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
//import {IonicModule} from "@ionic/angular";
import {FooterPage} from "../footer/footer.page";


@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css'],
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
    totalQuestions = 0;
    questions: Card[] = []; // Array für alle Fragen

//    currentQuestionIndex: number = 0; // Neue Variable für den Index der aktuellen Frage
    private cardsSubscription: Subscription;

    constructor(private cardService: CardService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.categoryId = this.route.snapshot.paramMap.get('categoryId');
        console.log('Category ID:', this.categoryId);
        this.loadCards(this.categoryId);
    }

    loadCategories(): void {
        this.categories$ = this.cardService.getCategoriesWithQuestionCounts();
    }

    loadCards(categoryId: string): void {
        this.cards$ = this.cardService.getAllCardsForCategory(categoryId);
        this.cardsSubscription = this.cards$.subscribe(
            (cards) => {
                console.log('Geladene Karten:', cards);
                if (cards.length > 0) {
                    this.questions = this.shuffleArray(cards); // Mische die Fragen
                    this.totalQuestions = this.questions.length;
                    this.currentQuestion = this.questions[0];
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
        if (this.selectedAnswers.includes(answer)) {
            this.selectedAnswers = this.selectedAnswers.filter(a => a !== answer);
        } else {
            this.selectedAnswers.push(answer);
        }
    }

    getNextQuestion(): void {
        this.showResult = false;
        this.selectedAnswers = [];
        const index = this.questions.indexOf(this.currentQuestion);
        if (index < this.questions.length - 1) {
            this.currentQuestion = this.questions[index + 1];
        } else {
            // Navigiere zur Statistikseite und übergebe die Ergebnisse
            this.router.navigate(['/stats'], {
                state: {
                    correctAnswers: this.correctAnswersCount,
                    incorrectAnswers: this.incorrectAnswersCount,
                }
            });
        }
    }

    checkAnswers(): void {
       const isCorrect = this.selectedAnswers.every(answer => this.currentQuestion.correctAnswer.includes(answer)) && this.currentQuestion.correctAnswer.every(answer => this.selectedAnswers.includes(answer));
        if(isCorrect) {
            this.correctAnswersCount++
        } else {
            this.incorrectAnswersCount++;
        }
        this.showResult = true;
        setTimeout(() => {
            this.getNextQuestion();
        }, 1000); // Warte eine Sekunde bevor die nächste Frage geladen wird
    }

    isCorrectAnswer(answer: string): boolean {
        return this.currentQuestion.correctAnswer.includes(answer);
    }

    isAnswerCorrect(): boolean {
        return this.currentQuestion.correctAnswer.every((ans) =>
            this.selectedAnswers.includes(ans));
    }

    ngOnDestroy(): void {
        if (this.cardsSubscription) {
            this.cardsSubscription.unsubscribe();
        }
    }
}
