// card.model.ts
export interface Card {
    id?: string;
    categoryId: string; // ID der Kategorie, zu der die Karte gehört
    question: string;
    answers: string[]; // Array von Antwortmöglichkeiten
    correctAnswer: string[]; // Array von korrekten Antworten
}