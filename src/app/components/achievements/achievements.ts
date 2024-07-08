// src/app/components/achievements/achievements.ts
import { Stats } from '../../models/stats.model';

/**
 * @constant ACHIEVEMENTS
 * @description Liste der Errungenschaften mit ihren Bedingungen.
 */

export const ACHIEVEMENTS = [
    { id: 1, name: 'First Step', description: 'First correct answer!', condition: (stats: Stats) => stats.correctAnswers >= 1 },
    { id: 2, name: 'Quick Learner', description: 'Five correct answers!', condition: (stats: Stats) => stats.correctAnswers >= 5 },
    { id: 3, name: 'Perseverance', description: 'Ten correct answers!', condition: (stats: Stats) => stats.correctAnswers >= 10 },
    { id: 4, name: 'First Module Finished', description: 'Completed the first module!', condition: (stats: Stats) => stats.completedQuizzes >= 1 },
    { id: 5, name: 'Consistent Performer', description: 'Maintained a correct answer rate of 80% or more across 5 quizzes!', condition: (stats: Stats) => stats.correctAnswers / (stats.correctAnswers + stats.incorrectAnswers) >= 0.8 && stats.completedQuizzes >= 5 },
    { id: 6, name: 'Quiz Master', description: 'Completed 10 quizzes!', condition: (stats: Stats) => stats.completedQuizzes >= 10 },
];
