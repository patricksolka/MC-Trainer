// card.service.ts
import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where
} from '@angular/fire/firestore';
import {Card} from '../models/card.model';
import {combineLatest, Observable} from 'rxjs';
import {Category} from '../models/categories.model';
import {map, switchMap} from 'rxjs/operators';
import {CategoryService} from "./category.service";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private cardsCollection: CollectionReference<Card>;
  private userCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private categoryService: CategoryService,private authService: AuthService) {
    this.cardsCollection = collection(firestore, 'cards') as CollectionReference<Card>;
    this.userCollection = collection(firestore, 'users') as CollectionReference<DocumentData>;
  }

  getCategories(): Observable<Category[]> {
    const categoriesCollection = collection(this.firestore, 'categories') as CollectionReference<Category>;
    return collectionData(categoriesCollection, { idField: 'id' });
  }

  // CRUD-Operationen für Karten
  getAllCardsForCategory(categoryId: string): Observable<Card[]> {
    const categoryCardsQuery = query(this.cardsCollection, where('categoryId', '==', categoryId));
    return collectionData(categoryCardsQuery, { idField: 'id' }) as Observable<Card[]>;
  }

  getCategoriesWithQuestionCounts(): Observable<Category[]> {
    const categoriesCollection = collection(this.firestore, 'categories') as CollectionReference<Category>;
    return collectionData(categoriesCollection, { idField: 'id' }).pipe(
        switchMap(categories => {
          const categoriesWithCounts$ = categories.map(category =>
              collectionData(
                  query(this.cardsCollection, where('categoryId', '==', category.id)),
                  { idField: 'id' }
              ).pipe(
                  map(cards => ({ ...category, questionCount: cards.length }))
              )
          );
          return combineLatest(categoriesWithCounts$);
        })
    );
  }

  getCardById(id: string): Observable<Card> {
    const cardDoc = doc(this.firestore, `cards/${id}`);
    return docData(cardDoc, { idField: 'id' }) as Observable<Card>;
  }

  async addCard(card: Card): Promise<void> {
    await addDoc(this.cardsCollection, card);
    const categoryDoc = doc(this.firestore, `categories/${card['categoryId']}`);
    const categoryData = await docData(categoryDoc).toPromise();
    await updateDoc(categoryDoc, { questionCount: (categoryData['questionCount'] || 0) + 1 });
  }

  async updateCardAnsweredCounter(cardid: string, counter: string){
    const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/answers/${cardid}`);
    const newCount = await this.getCardAnsweredCounter(cardid) + 1;
    await updateDoc(userDoc, {
      [`${counter}`]: newCount
    });
  }

  async getCardAnsweredCounter(cardid: string) : Promise<number>{
    const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/answers/${cardid}`);
    const userSnap = await getDoc(userDoc);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const counter = data?.['counter'] || 0;
      return counter;
    } else {
      await setDoc(userDoc, { counter: 0 });
      return 0;
    }
  }

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
    await updateDoc(categoryDoc, { questionCount: (categoryData['questionCount'] || 1) - 1 });
  }

  async addLearningSession(uid: string, categoryId: string, cardId: string, startTime: Date, endTime: Date): Promise<void> {
    try {
      const learningSessionsRef = collection(this.firestore, `users/${uid}/learningSessions`);
      const docRef = doc(learningSessionsRef, categoryId);
      const docSnap = await getDoc(docRef);

      const startTimeStamp = Timestamp.fromDate(startTime);
      const endTimeStamp = Timestamp.fromDate(endTime);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          categoryId,
          cardId,
          startTime: startTimeStamp,
          endTime: endTimeStamp,
          duration: (endTime.getTime() - startTime.getTime()) / 1000 / 60 // Dauer in Minuten
          // Dauer in Minuten
        });
      }
      console.log('Learning session added successfully');

    } catch (error) {
      console.error('Error adding learning session:', error);
    }
  }

  async getLearningSessions(uid: string): Promise<DocumentData[]> {
    try {
      //const userRef = doc(this.firestore, `users/${userId}`);

      const learningSessionsRef = collection(this.firestore, `users/${uid}/learningSessions`);
      const snapshot = await getDocs(learningSessionsRef);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return data['duration'];
      });

    } catch (error) {
      console.error('Error fetching learning sessions:', error);
      return [];
    }
  }
}
