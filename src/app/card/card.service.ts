import { Injectable } from '@angular/core';
import { Question } from '../question.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private questions: Question[] = [
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

  constructor() { }

  getQuestions(): Question[] {
    return this.questions;
  }
}
