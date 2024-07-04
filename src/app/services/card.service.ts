// card.service.ts
import {Injectable} from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    CollectionReference,
    getDoc, setDoc, DocumentData, getDocs, Timestamp, onSnapshot, Unsubscribe
} from '@angular/fire/firestore';
import {Card} from '../models/card.model';
import {Observable, combineLatest} from 'rxjs';
import {Category} from '../models/categories.model';
import {map, switchMap} from 'rxjs/operators';
import {AuthService} from "./auth.service";
import {CategoryService} from "./category.service";


@Injectable({
    providedIn: 'root'
})
export class CardService {
    private readonly cardsCollection: CollectionReference<Card>;
    // private userCollection: CollectionReference<DocumentData>;
    private subscription: Unsubscribe | null = null;

    constructor(private firestore: Firestore, private authService: AuthService, private categoryService: CategoryService) {
        this.cardsCollection = collection(firestore, 'cards') as CollectionReference<Card>;
        // this.userCollection = collection(firestore, 'users') as CollectionReference<DocumentData>;
    }
/*
    getCategories(): Observable<Category[]> {
        const categoriesCollection = collection(this.firestore, 'categories') as CollectionReference<Category>;
        return collectionData(categoriesCollection, {idField: 'id'});
    }
    */
    // CRUD-Operationen für Karten
    getAllCardsForCategory(categoryId: string): Observable<Card[]> {
        const categoryCardsQuery = query(this.cardsCollection, where('categoryId', '==', categoryId));
        return collectionData(categoryCardsQuery, {idField: 'id'}) as Observable<Card[]>;
    }

    getCategoriesWithQuestionCounts(): Observable<Category[]> {
        const categoriesCollection = collection(this.firestore, 'categories') as CollectionReference<Category>;
        return collectionData(categoriesCollection, {idField: 'id'}).pipe(
            switchMap(categories => {
                const categoriesWithCounts$ = categories.map(category =>
                    collectionData(
                        query(this.cardsCollection, where('categoryId', '==', category.id)),
                        {idField: 'id'}
                    ).pipe(
                        map(cards => ({...category, questionCount: cards.length}))
                    )
                );
                return combineLatest(categoriesWithCounts$);
            })
        );
    }

    /*
    getCardById(id: string): Observable<Card> {
        const cardDoc = doc(this.firestore, `cards/${id}`);
        return docData(cardDoc, {idField: 'id'}) as Observable<Card>;
    }
    */
    /*
    async addCard(card: Card): Promise<void> {
        await addDoc(this.cardsCollection, card);
        const categoryDoc = doc(this.firestore, `categories/${card['categoryId']}`);
        const categoryData = await docData(categoryDoc).toPromise();
        await updateDoc(categoryDoc, {questionCount: (categoryData['questionCount'] || 0) + 1});
    }
    */

    async updateCardAnsweredCounter(cardid: string, counter: string) {
        const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/answers/${cardid}`);
        const newCount = await this.getCardAnsweredCounter(cardid) + 1;
        await updateDoc(userDoc, {
            [`${counter}`]: newCount
        });
    }

    async setCategoryDone(categoryId: string, attribute: string, done: boolean): Promise<void> {
        await this.categoryService.setDone(categoryId, attribute, done);
    }

    async resetCardAnsweredCounter(cardid: string, counter: string) {
        const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/answers/${cardid}`);
        const newCount = 0;
        await updateDoc(userDoc, {
            [`${counter}`]: newCount
        });
    }

    async getCardAnsweredCounter(cardid: string): Promise<number> {
        const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/answers/${cardid}`);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
            const data = userSnap.data();
            /*const counter = data?.['counter'] || 0;
            return counter;*/
            return data?.['counter'] || 0;
        } else {
            await setDoc(userDoc, {counter: 0});
            return 0;
        }
    }

   /*
    updateCard(id: string, card: Partial<Card>): Promise<void> {
        const cardDoc = doc(this.firestore, `cards/${id}`);
        return updateDoc(cardDoc, card);
    }

    async deleteCard(id: string): Promise<void> {
        const cardDoc = doc(this.firestore, `cards/${id}`);
        const cardData = await docData(cardDoc).toPromise();
        await deleteDoc(cardDoc);
        const categoryDoc = doc(this.firestore, `categories/${cardData['categoryId']}`);
        const categoryData = await docData(categoryDoc).toPromise();
        await updateDoc(categoryDoc, {questionCount: (categoryData['questionCount'] || 1) - 1});
    }
    */

    getLearningSession(uid: string): Observable<DocumentData[]> {
        return new Observable<DocumentData[]>(observer => {
            const learningSessionsRef = collection(this.firestore, `users/${uid}/learningSessions`);

            getDocs(learningSessionsRef).then(docSnap => {
                    const result = docSnap.docs.map(doc => doc.data());
                    observer.next(result);
                    console.log('learningSession',result);

            });

            // Snapshot-Listeners
            this.subscription = onSnapshot(learningSessionsRef, (snapshot) => {
                const data: DocumentData[] = snapshot.docs.map(doc => doc.data());
                observer.next(data);
            });
        });
    }



    /*async getLearningSession(uid: string): Promise<DocumentData[]> {
        try {
            const learningSessionsRef = collection(this.firestore, `users/${uid}/learningSessions`);
            const docSnap = await getDocs(learningSessionsRef);

            if (!docSnap.empty) {
                return docSnap.docs.map(doc => doc.data());
            } else {
                console.log("No learning sessions found.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching learning sessions: ", error);
            throw new Error('Error fetching learning sessions');
        }
    }*/

    async addLearningSession(uid: string, categoryId: string, cardId: string, startTime: Date, endTime: Date): Promise<void> {
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
            } else {
                //if learningSessions exists add new duration to existing duration
                const currentDuration = docSnap.data()['duration'] || 0;
                const updatedDuration = currentDuration + newDuration;
                await updateDoc(docRef, {
                    endTime: endTimeStamp,
                    duration: updatedDuration
                });
            }

            console.log('Learning session added successfully');

        } catch (error) {
            console.error('Error adding learning session:', error);
        }
    }

    //Reset if older than 24 hours
    async resetLearningSession(uid: string) {
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
        } catch (error) {
            console.error('Error resetting learning session:', error);
        }
    }


    /*async getLearningSessions(uid: string): Promise<DocumentData[]> {
      try {
        //const userRef = doc(this.firestore, `users/${userId}`);
        const learningSessionsRef = collection(this.firestore, `users/${uid}/learningSessions`);
        const snapshot = await getDocs(learningSessionsRef);
        return snapshot.docs.map(doc => doc.data());

      } catch (error) {
        console.error('Error fetching learning sessions:', error);
        return [];
      }
    }*/
    // als Promise
    /* async getLearningSessions(uid: string): Promise<DocumentData[]> {
       const learningSessionsRef = collection(this.firestore, `users/${uid}/learningSessions`);

       // Einmaliges Abrufen der Daten
       const docSnap = await getDocs(learningSessionsRef);
       const result = docSnap.docs.map(doc => doc.data());

       // Hinzufügen eines Snapshot-Listeners
       this.subscription = onSnapshot(learningSessionsRef, (snapshot) => {
         const duration: number[] = snapshot.docs.map(doc => doc.data()['duration']);
         console.log('balbaa', duration); // Hier können Sie die erhaltenen Daten weiterverarbeiten' oder speichern
       });

       return result;
     }*/

    //als Observable

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription();
            this.subscription = null;
            console.log('unsubscribe from learning sessions');
        }
    }
}