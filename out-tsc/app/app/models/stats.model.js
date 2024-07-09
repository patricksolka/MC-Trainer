/*// stats.model.ts
export class Stats {
    correctAnswers: number;
    incorrectAnswers: number;
    //completedQuizzes: number;
    //totalQuestions: number;

    constructor(correctAnswers: number, incorrectAnswers: number) {
        this.correctAnswers = correctAnswers;
        this.incorrectAnswers = incorrectAnswers;
    }
}*/
/**
 * @fileoverview Diese Datei enthält die Implementierung der Stats-Klasse,
 * die die Statistiken der Benutzerquizze speichert.
 */
/**
 * @class Stats
 * @description Diese Klasse speichert die Statistiken der Benutzerquizze, einschließlich der Anzahl der richtigen und falschen Antworten sowie der abgeschlossenen Quizze.
 */
export class Stats {
    /**
     * @constructor
     * @param {Stats} [currentStats] - Die aktuellen Statistiken.
     * @param {Stats} [newStats] - Die neuen Statistiken, die hinzugefügt werden sollen.
     */
    constructor(currentStats, newStats) {
        this.correctAnswers = (currentStats?.correctAnswers || 0) + (newStats?.correctAnswers || 0);
        this.incorrectAnswers = (currentStats?.incorrectAnswers || 0) + (newStats?.incorrectAnswers || 0);
        this.completedQuizzes = (currentStats?.completedQuizzes || 0) + (newStats?.completedQuizzes || 0);
        this.completedCards = (currentStats?.completedCards || 0) + (newStats?.completedCards || 0);
    }
}
//# sourceMappingURL=stats.model.js.map