import { Stats } from '../../models/stats.model';
/**
 * @constant ACHIEVEMENTS
 * @description Liste der Errungenschaften mit ihren Bedingungen.
 */

import {Achievement} from "../../models/achievement.model";
export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 1,
        name: 'Erster Schritt',
        description: 'Erste richtige Antwort!',
        icon: 'trophy-outline',
        condition: (stats: Stats) => stats.correctAnswers >= 1
    },
    {
        id: 2,
        name: 'Erstes Quiz',
        description: 'Erstes Quiz abgeschlossen!',
        icon: 'ribbon-outline',
        condition: (stats: Stats) => stats.completedQuizzes >= 1
    },
    {
        id: 3,
        name: 'Schneller Lerner',
        description: 'Fünf richtige Antworten!',
        icon: 'flash-outline',
        condition: (stats: Stats) => stats.correctAnswers >= 5
    },
    {
        id: 4,
        name: 'Durchhaltevermögen',
        description: 'Zehn richtige Antworten!',
        icon: 'medal-outline',
        condition: (stats: Stats) => stats.correctAnswers >= 10
    },
    {
        id: 5,
        name: 'Glanzleistung',
        description: 'Zwanzig richtige Antworten!',
        icon: 'star-outline',
        condition: (stats: Stats) => stats.correctAnswers >= 20
    },
    {
        id: 6,
        name: 'Quiz-Meister',
        description: 'Zehn Quizze abgeschlossen!',
        icon: 'ribbon',
        condition: (stats: Stats) => stats.completedQuizzes >= 10
    },
    {
        id: 7,
        name: 'Meisterleistung',
        description: 'Fünfzig richtige Antworten!',
        icon: 'diamond-outline',
        condition: (stats: Stats) => stats.correctAnswers >= 50
    },
    {
        id: 8,
        name: 'Meilenstein',
        description: 'Hundert richtige Antworten!',
        icon: 'podium-outline',
        condition: (stats: Stats) => stats.correctAnswers >= 100
    },
    {
        id: 9,
        name: 'Triumph',
        description: 'Fünfhundert richtige Antworten!',
        icon: 'flower',
        condition: (stats: Stats) => stats.correctAnswers >= 500
    },
    {
        id: 10,
        name: 'Spitzenleistung',
        description: 'Tausend richtige Antworten!',
        icon: 'trophy',
        condition: (stats: Stats) => stats.correctAnswers >= 1000
    }

];

