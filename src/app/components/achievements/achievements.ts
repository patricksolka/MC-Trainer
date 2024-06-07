import { Stats } from '../../models/stats.model';

export const ACHIEVEMENTS = [
    { id: 1, name: 'First Step', description: 'Complete your first quiz', condition:
            (stats: Stats) => stats.completedQuizzes >= 1 },
    { id: 2, name: 'Quiz Master', description: 'Get 100% correct answers in a quiz', condition:
            (stats: Stats) => stats.correctAnswers === stats.totalQuestions },
    // weitere Achievements hinzufügen
];
