export const ACHIEVEMENTS = [
    {
        id: 1,
        name: 'Erster Schritt',
        description: 'Erste richtige Antwort!',
        icon: 'trophy-outline',
        condition: (stats) => stats.correctAnswers >= 1
    },
    {
        id: 2,
        name: 'Schneller Lerner',
        description: 'Fünf richtige Antworten!',
        icon: 'flash-outline',
        condition: (stats) => stats.correctAnswers >= 5
    },
    {
        id: 3,
        name: 'Durchhaltevermögen I',
        description: 'Zehn richtige Antworten!',
        icon: 'medal-outline',
        condition: (stats) => stats.correctAnswers >= 10
    },
    {
        id: 4,
        name: 'Durchhaltevermögen II',
        description: 'Zwanzig richtige Antworten!',
        icon: 'trophy-outline',
        condition: (stats) => stats.correctAnswers >= 20
    },
    {
        id: 5,
        name: 'Durchhaltevermögen III',
        description: 'Fünfzig richtige Antworten!',
        icon: 'diamond-outline',
        condition: (stats) => stats.correctAnswers >= 50
    },
    {
        id: 6,
        name: 'Durchhaltevermögen IV',
        description: 'Hundert richtige Antworten!',
        icon: 'podium-outline',
        condition: (stats) => stats.correctAnswers >= 100
    },
    {
        id: 7,
        name: 'Durchhaltevermögen V',
        description: 'Fünfhundert richtige Antworten!',
        icon: 'ribbon-outline',
        condition: (stats) => stats.correctAnswers >= 500
    },
    {
        id: 8,
        name: 'Durchhaltevermögen VI',
        description: 'Tausend richtige Antworten!',
        icon: 'trophy',
        condition: (stats) => stats.correctAnswers >= 1000
    },
    {
        id: 9,
        name: 'Erstes Modul abgeschlossen',
        description: 'Erstes Modul abgeschlossen!',
        icon: 'checkmark-circle-outline',
        condition: (stats) => stats.completedQuizzes >= 1
    },
    {
        id: 10,
        name: 'Quiz-Meister',
        description: 'Zehn Quizze abgeschlossen!',
        icon: 'ribbon',
        condition: (stats) => stats.completedQuizzes >= 10
    },
];
//# sourceMappingURL=achievements.js.map