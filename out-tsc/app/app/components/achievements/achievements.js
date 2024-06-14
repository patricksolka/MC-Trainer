export const ACHIEVEMENTS = [
    { id: 1, name: 'First Step', description: 'Complete your first quiz', condition: (stats) => stats.completedQuizzes >= 1 },
    { id: 2, name: 'Quiz Master', description: 'Get 100% correct answers in a quiz', condition: (stats) => stats.correctAnswers === stats.totalQuestions },
    // weitere Achievements hinzufügen
];
//# sourceMappingURL=achievements.js.map