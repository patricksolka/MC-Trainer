// card.model.ts
/**
 * @fileoverview Diese Datei enthält das Card-Interface, das die Struktur einer Karte definiert.
 */

/**
 * @interface Card
 * @description Dieses Interface definiert die Struktur einer Karte, die eine Frage, Antwortmöglichkeiten und korrekte Antworten enthält.
 */

export interface Card {
    id?: string;
    categoryId: string; // ID der Kategorie, zu der die Karte gehört
    question: string;
    answers: string[]; // Array von Antwortmöglichkeiten
    correctAnswer: string[]; // Array von korrekten Antworten
}