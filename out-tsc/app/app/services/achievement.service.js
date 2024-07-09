import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { ACHIEVEMENTS } from '../components/achievements/achievements';
import { doc, setDoc, collection, getDocs } from "@angular/fire/firestore";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../models/user.model";
let AchievementService = class AchievementService {
    constructor(firestore, authService) {
        this.firestore = firestore;
        this.authService = authService;
        this.achieved = new Set();
        this.user = User;
        this.achievementConverter = {
            toFirestore(achievement) {
                return {
                    id: achievement.id,
                    name: achievement.name,
                    description: achievement.description,
                    condition: achievement.condition.toString()
                };
            },
            fromFirestore(snapshot) {
                const data = snapshot.data();
                return {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    condition: eval(data.condition)
                };
            }
        };
        this.userCollectionRef = collection(firestore, 'users');
    }
    checkAchievements(stats) {
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
    getAchieved() {
        return this.achieved;
    }
    async setAchievement(id) {
        const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/achievements/${id}`);
        const userSnap = await setDoc(userDoc, { done: true });
    }
    loadAchievements(userId) {
        const achievementsCollection = collection(this.firestore, `users/${userId}/achievements`).withConverter(this.achievementConverter);
        const achievementsDocs = getDocs(achievementsCollection);
        return from(achievementsDocs).pipe(map(querySnapshot => {
            const achievements = new Set();
            console.log(`Received querySnapshot with ${querySnapshot.size} documents.`);
            querySnapshot.forEach(doc => {
                console.log(`Processing document with id: ${doc.id}`);
                achievements.add(parseInt(doc.id, 10));
            });
            return achievements;
        }));
    }
    getAchievements() {
        return ACHIEVEMENTS.filter(achievement => this.achieved.has(achievement.id));
    }
    setAchievements() {
        const userId = this.authService.auth.currentUser.uid;
        this.loadAchievements(userId).subscribe(achievements => {
            this.achieved = achievements;
        });
    }
    ngOnInit() {
        this.setAchievements();
    }
};
AchievementService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], AchievementService);
export { AchievementService };
//# sourceMappingURL=achievement.service.js.map