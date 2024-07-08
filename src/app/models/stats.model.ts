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

export class Stats {
    [key: string]: any;

    correctAnswers: number;
    incorrectAnswers: number;
    completedQuizzes: number;

    constructor(currentStats?: Stats, newStats?: Stats) {
        this.correctAnswers = (currentStats?.correctAnswers || 0) + (newStats?.correctAnswers || 0);
        this.incorrectAnswers = (currentStats?.incorrectAnswers || 0) + (newStats?.incorrectAnswers || 0);
        this.completedQuizzes = (currentStats?.completedQuizzes || 0) + (newStats?.completedQuizzes || 0);
    }
}



