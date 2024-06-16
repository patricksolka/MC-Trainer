// card.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
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


@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule, IonHeader, IonContent, IonToolbar, IonTitle, IonList, IonItem, IonCard, IonCardHeader, IonCardContent, IonButton]
})
export class CardComponent implements OnInit, OnDestroy {
    categories$: Observable<Category[]>;
    cards$: Observable<Card[]>;
    categoryId: string;
    selectedCategoryId: string;
    currentQuestion: Card;
    showResult = false;
    selectedAnswers: string[] = [];
    currentQuestionIndex: number = 0; // Neue Variable für den Index der aktuellen Frage
    questions: Card[] = []; // Array für alle Fragen

    private cardsSubscription: Subscription;

    constructor(private cardService: CardService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.categoryId = this.route.snapshot.paramMap.get('categoryId');
        console.log('Category ID:', this.categoryId);
        this.loadCards(this.categoryId);
    }

    loadCards(categoryId: string): void {
        this.cards$ = this.cardService.getAllCardsForCategory(categoryId);
        this.cardsSubscription = this.cards$.subscribe({
            next: (cards) => {
                console.log('Geladene Karten:', cards);
                if (cards.length > 0) {
                    this.questions = cards; // Aktualisieren Sie die Fragen
                    this.currentQuestion = this.questions[0];
                } else {
                    console.warn('Keine Karten gefunden für die Kategorie mit ID:', categoryId);
                }
            },
            error: (error) => {
                console.error('Fehler beim Laden der Karten:', error);
            }
        });
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
        // Implementiere hier die Logik, um die nächste Frage zu laden
        this.currentQuestionIndex++; // Inkrementiere den Index für die nächste Frage

        if (this.currentQuestionIndex < this.questions.length) {
            this.currentQuestion = this.questions[this.currentQuestionIndex];
        } else {
            // Hier könnten Sie Logik hinzufügen, wenn alle Fragen beantwortet wurden
            console.log('Alle Fragen wurden beantwortet!');
        }
    }

    checkAnswers(): void {
        this.isAnswerCorrect = () => {
            return this.selectedAnswers.every(answer => this.currentQuestion.correctAnswer.includes(answer)) &&
                this.currentQuestion.correctAnswer.every(answer => this.selectedAnswers.includes(answer));
        };
        this.showResult = true;
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
