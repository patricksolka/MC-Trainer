import { Injectable } from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    docData,
    query,
    where,
    CollectionReference,
    getDoc
} from '@angular/fire/firestore';
import {Card} from "../models/card.model";
import {User} from "../models/user.model";
import {UserService} from "./user.service";
import {AuthService} from "./auth.service";



@Injectable({
    providedIn: 'root'
})
export class TotalStatsService {
    private totalCorrectAnswers: number = 0;
    private totalIncorrectAnswers: number = 0;

    private cardsCollection: CollectionReference<Card>;

    constructor(private firestore: Firestore, private userService: UserService, private authService: AuthService) {

        this.initializeStats();
        console.log(this.totalCorrectAnswers);

    }

    ngOnInit(){

    }
    updateStats(correct: number, incorrect: number) {
        this.totalCorrectAnswers += correct;
        this.totalIncorrectAnswers += incorrect;
        console.log(this.authService.auth.currentUser.uid);
        this.updatedateFirebaseStats(this.authService.auth.currentUser.uid, "correctAnswers", this.totalCorrectAnswers);
        this.updatedateFirebaseStats(this.authService.auth.currentUser.uid, "incorrectAnswers", this.totalIncorrectAnswers);

    }

    async initializeStats(){
        await this.getFirebaseStats(this.authService.auth.currentUser.uid);
    }
    async getFirebaseStats(uid: string) {
        const userDoc = doc(this.firestore, `users/${uid}`);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
            const data = userSnap.data();
            const correctAnswers = data?.['stats'].correctAnswers || 0;
            const incorrectAnswers = data?.['stats'].incorrectAnswers || 0;
            this.totalCorrectAnswers = correctAnswers;
            this.totalIncorrectAnswers = incorrectAnswers;
        } else {
            console.log("No such document!");
        }
    }
    async updatedateFirebaseStats(uid: string, categoryId: string, x: number){
        const userDoc = doc(this.firestore, `users/${uid}`);
        await updateDoc(userDoc, {
            [`stats.${categoryId}`]: x
        });
    }

    getTotalCorrectAnswers(): number {
        return this.totalCorrectAnswers;
    }

    getTotalIncorrectAnswers(): number {
        return this.totalIncorrectAnswers;
    }

    resetStats() {
        this.totalCorrectAnswers = 0;
        this.totalIncorrectAnswers = 0;
        this.updatedateFirebaseStats(this.authService.auth.currentUser.uid, "correctAnswers", 0);
        this.updatedateFirebaseStats(this.authService.auth.currentUser.uid, "incorrectAnswers", 0);
    }
}
