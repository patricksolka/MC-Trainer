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
/*export class Stats {
    [key: string]: any;

    //completedQuizzes: number;
    //totalQuestions: number;

    constructor(
        //public id: number | any = null,
        public correctAnswers: number | any = null,
        public incorrectAnswers: number | any = null,
        public completedQuizzes: number | any = null,
    ) {}
}*/

// models/stats.model.ts

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


/*export class TotalStats {
[key: string]: any;

    //completedQuizzes: number;
    //totalQuestions: number;

    constructor(
        //public id: number | any = null,
        /!*public stats: Stats | any = null,*!/
        public completedQuizzes: number | any = null,
        //public totalQuestions: number | any = null,
        public totalIncorrectAnswers: number | any = null,
        public totalCorrectAnswers: number | any = null
    ) {
        /!*this.totalCorrectAnswers = this.totalCorrectAnswers || 0;
        this.totalIncorrectAnswers = this.totalIncorrectAnswers || 0;
        this.completedQuizzes = this.completedQuizzes || 0;*!/
    }
}*/

/*export class totalStats{
    stats: Stats;
    completedQuizzes: number;
    totalQuestions: number;
    totalIncorrectAnswers: number;
    totalCorrectAnswers: number;

    constructor(stats: Stats, completedQuizzes: number, totalQuestions: number, totalIncorrectAnswers: number, totalCorrectAnswers: number) {
        this.stats = stats;
        this.completedQuizzes = completedQuizzes;
        this.totalQuestions = totalQuestions;
        this.totalIncorrectAnswers = totalIncorrectAnswers;
        this.totalCorrectAnswers = totalCorrectAnswers;
    }
}*/
