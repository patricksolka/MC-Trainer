import { Stats } from '../../models/stats.model';

export const ACHIEVEMENTS = [
    { id: 1, name: 'First Step', description: 'First correct answer!', condition:
            (stats: Stats) => stats.correctAnswers >= 1 },
    { id: 2, name: 'So far so good', description: 'Five correct answers!', condition:
            (stats: Stats) => stats.correctAnswers >= 5 },
    // weitere Achievements hinzufügen
];
