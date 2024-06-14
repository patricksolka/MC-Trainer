import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let CardService = class CardService {
    constructor() {
        this.questions = [
            {
                question: 'What is the capital of Germany?',
                answers: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg'],
                correctAnswer: ['Berlin'] // Ändern Sie dies zu einem Array
            },
            {
                question: 'Which of the following are programming languages?',
                answers: ['Python', 'Java', 'HTML', 'CSS'],
                correctAnswer: ['Python', 'Java'] // Beispiel für mehrere korrekte Antworten
            },
            {
                question: 'Who wrote "To Kill a Mockingbird"?',
                answers: ['Harper Lee', 'Ernest Hemingway', 'J.K. Rowling', 'Stephen King'],
                correctAnswer: ['Harper Lee']
            },
            {
                question: 'What is the chemical symbol for water?',
                answers: ['H2O', 'CO2', 'NaCl', 'O2'],
                correctAnswer: ['H2O']
            }
            // Weitere Fragen hier
        ];
    }
    getQuestions() {
        return this.questions;
    }
};
CardService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CardService);
export { CardService };
//# sourceMappingURL=card.service.js.map