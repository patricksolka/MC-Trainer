import { Stats } from '../../models/stats.model';

export const ACHIEVEMENTS = [
    { id: 1, name: 'First Step', description: 'First correct answer!', condition: (stats: Stats) => stats.correctAnswers >= 1 },
    { id: 2, name: 'Quick Learner', description: 'Five correct answers!', condition: (stats: Stats) => stats.correctAnswers >= 5 },
    { id: 3, name: 'Perseverance I', description: 'Ten correct answers!', condition: (stats: Stats) => stats.correctAnswers >= 10 },
    { id: 4, name: 'Perseverance II', description: 'Twenty correct answers!', condition: (stats: Stats) => stats.correctAnswers >= 20 },
    { id: 5, name: 'Perseverance III', description: 'Fifty correct answers!', condition: (stats: Stats) => stats.correctAnswers >= 50 },
    { id: 6, name: 'Perseverance IV', description: 'Hundred correct answers!', condition: (stats: Stats) => stats.correctAnswers >= 100 },

    { id: 11, name: 'PPPPP', description: 'Hundred correct answers!', condition: (stats: Stats) => stats.correctAnswers >= 130 },

    { id: 7, name: 'Perseverance V', description: 'Five hundred correct answers!', condition: (stats: Stats) => stats.correctAnswers >= 500 },
    { id: 8, name: 'Perseverance VI', description: 'Thousand correct answers!', condition: (stats: Stats) => stats.correctAnswers >= 1000 },
    { id: 9, name: 'First Module Finished', description: 'Completed the first module!', condition: (stats: Stats) => stats.completedQuizzes >= 1 },
    { id: 10, name: 'Quiz Master', description: 'Completed 10 quizzes!', condition: (stats: Stats) => stats.completedQuizzes >= 10 },
];
