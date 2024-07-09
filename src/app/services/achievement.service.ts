import { Injectable } from '@angular/core';
import { ACHIEVEMENTS } from '../components/achievements/achievements';
import {
    doc,
    Firestore,
    getDoc,
    setDoc,
    collection,
    getDocs,
    CollectionReference, DocumentData
} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";
import {from, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {User} from "../models/user.model";
import {Achievement} from "../models/achievement.model";

@Injectable({
    providedIn: 'root',
})
export class AchievementService {
    private achieved: Set<number> = new Set();

    public user = User

    userCollectionRef: CollectionReference<DocumentData>

    constructor(private firestore: Firestore, private authService: AuthService) {
        this.userCollectionRef = collection(firestore, 'users');
    }

    checkAchievements(stats: { completedQuizzes: number; correctAnswers: number, incorrectAnswers: number, totalQuestions: number, completedCards: number }): Achievement[] {
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
        const achievementsCollection = collection(this.firestore, `users/${userId}/achievements`).withConverter(this.achievementConverter);
        const achievementsDocs = getDocs(achievementsCollection);

        return from(achievementsDocs).pipe(
            map(querySnapshot => {
                const achievements = new Set<number>();
                console.log(`Received querySnapshot with ${querySnapshot.size} documents.`);

                querySnapshot.forEach(doc => {
                    console.log(`Processing document with id: ${doc.id}`);
                    achievements.add(parseInt(doc.id, 10));
                });

                return achievements;
            })
        );
    }






    getAchievements(): Achievement[] {
        return ACHIEVEMENTS.filter(achievement => this.achieved.has(achievement.id));
    }





    setAchievements(){
        const userId = this.authService.auth.currentUser.uid;
        this.loadAchievements(userId).subscribe(achievements => {
            this.achieved = achievements;
        });
    }

    private achievementConverter = {
        toFirestore(achievement: Achievement): any {
            return {
                id: achievement.id,
                name: achievement.name,
                description: achievement.description,
                condition: achievement.condition.toString(),
                icon: achievement.icon
            };
        },
        fromFirestore(snapshot: any): Achievement {
            const data = snapshot.data();
            return {
                id: data.id,
                name: data.name,
                description: data.description,
                condition: eval(data.condition),
                icon: data.icon
            };
        }
    }

    ngOnInit(){
        this.setAchievements();
    }
}
