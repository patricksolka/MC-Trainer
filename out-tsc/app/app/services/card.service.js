import { __decorate } from "tslib";
// card.service.ts
import { Injectable } from '@angular/core';
import { collection, collectionData, doc, updateDoc, deleteDoc, query, where, getDoc, setDoc, getDocs, Timestamp, onSnapshot } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
let CardService = class CardService {
    constructor(firestore, authService, categoryService) {
        this.firestore = firestore;
        this.authService = authService;
        this.categoryService = categoryService;
        // private userCollection: CollectionReference<DocumentData>;
        this.subscription = null;
        this.cardsCollection = collection(firestore, 'cards');
        // this.userCollection = collection(firestore, 'users') as CollectionReference<DocumentData>;
    }
    // CRUD-Operationen für Karten
    getAllCardsForCategory(categoryId) {
        const categoryCardsQuery = query(this.cardsCollection, where('categoryId', '==', categoryId));
        return collectionData(categoryCardsQuery, { idField: 'id' });
    }
    getCategoriesWithQuestionCounts() {
        const categoriesCollection = collection(this.firestore, 'categories');
        return collectionData(categoriesCollection, { idField: 'id' }).pipe(switchMap(categories => {
            const categoriesWithCounts$ = categories.map(category => collectionData(query(this.cardsCollection, where('categoryId', '==', category.id)), { idField: 'id' }).pipe(map(cards => ({ ...category, questionCount: cards.length }))));
            return combineLatest(categoriesWithCounts$);
        }));
    }
    async updateCardAnsweredCounter(cardid, counter) {
        const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/answers/${cardid}`);
        const newCount = await this.getCardAnsweredCounter(cardid) + 1;
        await updateDoc(userDoc, {
            [`${counter}`]: newCount
        });
    }
    async setCategoryDone(categoryId, attribute, done) {
        await this.categoryService.setDone(categoryId, attribute, done);
    }
    async resetCardAnsweredCounter(cardid, counter) {
        const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/answers/${cardid}`);
        const newCount = 0;
        await updateDoc(userDoc, {
            [`${counter}`]: newCount
        });
    }
    async getCardAnsweredCounter(cardid) {
        const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/answers/${cardid}`);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
            const data = userSnap.data();
            /*const counter = data?.['counter'] || 0;
            return counter;*/
            return data?.['counter'] || 0;
        }
        else {
            await setDoc(userDoc, { counter: 0 });
            return 0;
        }
    }
    getLearningSession(uid) {
        return new Observable(observer => {
            const learningSessionsRef = collection(this.firestore, `users/${uid}/learningSessions`);
            getDocs(learningSessionsRef).then(docSnap => {
                const result = docSnap.docs.map(doc => doc.data());
                observer.next(result);
                console.log('learningSession', result);
            });
            // Snapshot-Listeners
            this.subscription = onSnapshot(learningSessionsRef, (snapshot) => {
                const data = snapshot.docs.map(doc => doc.data());
                observer.next(data);
            });
        });
    }
    async addLearningSession(uid, categoryId, cardId, startTime, endTime) {
        try {
            const learningSessionsRef = collection(this.firestore, `users/${uid}/learningSessions`);
            const docRef = doc(learningSessionsRef, categoryId);
            const docSnap = await getDoc(docRef);
            const startTimeStamp = Timestamp.fromDate(startTime);
            const endTimeStamp = Timestamp.fromDate(endTime);
            const newDuration = (endTime.getTime() - startTime.getTime()) / 1000 / 60;
            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    categoryId,
                    cardId,
                    startTime: startTimeStamp,
                    endTime: endTimeStamp,
                    duration: newDuration
                });
            }
            else {
                //if learningSessions exists add new duration to existing duration
                const currentDuration = docSnap.data()['duration'] || 0;
                const updatedDuration = currentDuration + newDuration;
                await updateDoc(docRef, {
                    endTime: endTimeStamp,
                    duration: updatedDuration
                });
            }
            console.log('Learning session added successfully');
        }
        catch (error) {
            console.error('Error adding learning session:', error);
        }
    }
    //Reset if older than 24 hours
    async resetLearningSession(uid) {
        try {
            const learningSessionsRef = collection(this.firestore, `users/${uid}/learningSessions`);
            const docSnap = await getDocs(learningSessionsRef);
            const currentTime = Date.now();
            console.log('currentTime', currentTime);
            docSnap.docs.forEach(doc => {
                const data = doc.data();
                const endTime = data['endTime'].toDate().getTime();
                if (currentTime - endTime > 24 * 60 * 60 * 1000) {
                    deleteDoc(doc.ref);
                }
            });
        }
        catch (error) {
            console.error('Error resetting learning session:', error);
        }
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription();
            this.subscription = null;
            console.log('unsubscribe from learning sessions');
        }
    }
};
CardService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CardService);
export { CardService };
//# sourceMappingURL=card.service.js.map