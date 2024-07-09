// card.service.ts
/**
 * @fileoverview Diese Datei enthält den CardService, der die Verwaltung und Operationen von Karten übernimmt.
 */
import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { collection, collectionData, doc, updateDoc, deleteDoc, query, where, getDoc, setDoc, getDocs, Timestamp, onSnapshot } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
/**
 * @class CardService
 * @description Dieser Service verwaltet die Kartenoperationen und Lernsessions des Benutzers.
 */
let CardService = class CardService {
    /**
     * @constructor
     * @param {Firestore} firestore - Firebase Firestore-Instanz.
     * @param {AuthService} authService - Service für Authentifizierungsoperationen.
     * @param {CategoryService} categoryService - Service für Kategorieoperationen.
     * @param ts
     * @param userService
     */
    constructor(firestore, authService, categoryService, ts, userService) {
        this.firestore = firestore;
        this.authService = authService;
        this.categoryService = categoryService;
        this.ts = ts;
        this.userService = userService;
        this.subscription = null;
        this.cardsCollection = collection(firestore, 'cards');
    }
    /**
     * @method getAllCardsForCategory
     * @description Holt alle Karten für eine bestimmte Kategorie.
     * @param {string} categoryId - Die ID der Kategorie.
     * @returns {Observable<Card[]>} - Ein Observable mit den Karten.
     */
    getAllCardsForCategory(categoryId) {
        const categoryCardsQuery = query(this.cardsCollection, where('categoryId', '==', categoryId));
        return collectionData(categoryCardsQuery, { idField: 'id' });
    }
    /**
     * @method getCategoriesWithQuestionCounts
     * @description Holt alle Kategorien und zählt die Fragen jeder Kategorie.
     * @returns {Observable<Category[]>} - Ein Observable mit den Kategorien und ihren Frageanzahlen.
     */
    getCategoriesWithQuestionCounts() {
        const categoriesCollection = collection(this.firestore, 'categories');
        return collectionData(categoriesCollection, { idField: 'id' }).pipe(switchMap(categories => {
            const categoriesWithCounts$ = categories.map(category => collectionData(query(this.cardsCollection, where('categoryId', '==', category.id)), { idField: 'id' }).pipe(map(cards => ({ ...category, questionCount: cards.length }))));
            return combineLatest(categoriesWithCounts$);
        }));
    }
    /**
     * @method updateCardAnsweredCounter
     * @description Aktualisiert den Zähler für beantwortete Fragen einer Karte.
     * @param {string} cardid - Die ID der Karte.
     * @param {string} counter - Der Zählername.
     */
    async updateCardAnsweredCounter(cardid, counter) {
        const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/answers/${cardid}`);
        const newCount = await this.getCardAnsweredCounter(cardid) + 1;
        await updateDoc(userDoc, {
            [`${counter}`]: newCount
        });
        console.log('newCount', newCount);
    }
    /**
     * @method setCategoryDone
     * @description Setzt den Status einer Kategorie auf 'done'.
     * @param {string} categoryId - Die ID der Kategorie.
     * @param {string} attribute - Der Attributname.
     * @param {boolean} done - Der Status.
     */
    async setCategoryDone(categoryId, attribute, done) {
        await this.ts.setDone(categoryId, done);
    }
    /**
     * @method resetCardAnsweredCounter
     * @description Setzt den Zähler für beantwortete Fragen einer Karte zurück.
     * @param cardid
     * @param {string} counter - Der Zählername.
     */
    async resetCardAnsweredCounter(cardid, counter) {
        const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/answers/${cardid}`);
        const newCount = 0;
        await updateDoc(userDoc, {
            [`${counter}`]: newCount
        });
    }
    /**
     * @method getCardAnsweredCounter
     * @description Holt den Zähler für beantwortete Fragen einer Karte.
     * @returns {Promise<number>} - Der Zählerwert.
     * @param cardid
     */
    async getCardAnsweredCounter(cardid) {
        const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/answers/${cardid}`);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
            const data = userSnap.data();
            return data?.['counter'] || 0;
        }
        else {
            await setDoc(userDoc, { counter: 0 });
            return 0;
        }
    }
    /**
     * @method getLearningSession
     * @description Holt die Lernsitzungen eines Benutzers.
     * @param {string} uid - Die Benutzer-ID.
     * @returns {Observable<DocumentData[]>} - Ein Observable mit den Lernsitzungen.
     */
    getLearningSession(uid) {
        return new Observable(observer => {
            const learningSessionsRef = collection(this.firestore, `users/${uid}/learningSessions`);
            getDocs(learningSessionsRef).then(docSnap => {
                const result = docSnap.docs.map(doc => doc.data());
                observer.next(result);
                console.log('learningSession', result);
            });
            this.subscription = onSnapshot(learningSessionsRef, (snapshot) => {
                const data = snapshot.docs.map(doc => doc.data());
                observer.next(data);
            });
        });
    }
    /**
     * @method addLearningSession
     * @description Fügt eine neue Lernsitzung hinzu oder aktualisiert die Dauer einer bestehenden Sitzung.
     * @param {string} uid - Die Benutzer-ID.
     * @param {string} categoryId - Die Kategorie-ID.
     * @param {string} cardId - Die Karten-ID.
     * @param {Date} startTime - Die Startzeit der Sitzung.
     * @param {Date} endTime - Die Endzeit der Sitzung.
     */
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
                const currentDuration = docSnap.data()['duration'] || 0;
                const updatedDuration = currentDuration + newDuration;
                await updateDoc(docRef, {
                    endTime: endTimeStamp,
                    duration: updatedDuration
                });
            }
        }
        catch (error) {
            console.error('Error adding learning session:', error);
        }
    }
    /**
     * @method resetLearningSession
     * @description Löscht Lernsitzungen, die älter als 24 Stunden sind.
     * @param {string} uid - Die Benutzer-ID.
     */
    async resetLearningSession(uid) {
        try {
            const learningSessionsRef = collection(this.firestore, `users/${uid}/learningSessions`);
            const docSnap = await getDocs(learningSessionsRef);
            const currentTime = Date.now();
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
    /**
     * @method ngOnDestroy
     * @description Lebenszyklus-Hook, der bei der Zerstörung der Komponente aufgerufen wird und die Abonnements beendet.
     */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription();
            this.subscription = null;
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