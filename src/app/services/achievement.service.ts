import { Injectable } from '@angular/core';
import { ACHIEVEMENTS } from '../components/achievements/achievements';
import {doc, Firestore, getDoc, setDoc, collection, getDocs} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";
import {from, Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class AchievementService {
    private achieved: Set<number> = new Set();

    constructor(private firestore: Firestore, private authService: AuthService) {}

    checkAchievements(stats: { completedQuizzes: number; correctAnswers: number, incorrectAnswers: number, totalQuestions: number }) {
        console.log('Checking achievements with stats:', stats);
        const newAchievements = ACHIEVEMENTS.filter(achievement => achievement.condition(stats))
            .filter(achievement => !this.achieved.has(achievement.id))
            .map(achievement => {
                this.achieved.add(achievement.id);
                this.setAchievement(achievement.id);
                return achievement;
            });
        console.log('New achievements:', newAchievements);
        return newAchievements;
    }

    getAchieved(){
        return this.achieved;
    }

    async setAchievement(id: number): Promise<void> {
        const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/achievements/${id}`);
        const userSnap = await setDoc(userDoc, {done: true});
    }

    loadAchievements(userId: string): Observable<Set<number>> {
        const achievementsCollection = collection(this.firestore, `users/${userId}/achievements`);
        const achievementsDocs = getDocs(achievementsCollection);
        return from(achievementsDocs).pipe(
            map(querySnapshot => {
                const achievements = new Set<number>();
                querySnapshot.forEach(doc => {
                    achievements.add(parseInt(doc.id, 10));
                });
                return achievements;
            })
        );
    }

    getAchievements() {
        return ACHIEVEMENTS.filter(achievement => this.achieved.has(achievement.id));
    }
    setAchievements(){
        const userId = this.authService.auth.currentUser.uid;
        this.loadAchievements(userId).subscribe(achievements => {
            this.achieved = achievements;
        });
    }

    ngOnInit(){
        this.setAchievements();
    }
}
