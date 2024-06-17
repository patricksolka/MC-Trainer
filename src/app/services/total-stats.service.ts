import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TotalStatsService {
    private totalCorrectAnswers: number = 0;
    private totalIncorrectAnswers: number = 0;

    constructor() {}

    updateStats(correct: number, incorrect: number) {
        this.totalCorrectAnswers += correct;
        this.totalIncorrectAnswers += incorrect;
    }

    getTotalCorrectAnswers(): number {
        return this.totalCorrectAnswers;
    }

    getTotalIncorrectAnswers(): number {
        return this.totalIncorrectAnswers;
    }

    resetStats() {
        this.totalCorrectAnswers = 0;
        this.totalIncorrectAnswers = 0;
    }
}
