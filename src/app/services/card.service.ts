// card.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Card } from '../models/card.model';
import { Observable } from 'rxjs';
import { query, where, CollectionReference } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private cardsCollection = collection(this.firestore, 'cards');

  constructor(private firestore: Firestore) { }

  // CRUD-Operationen für Karten
  getAllCardsForCategory(categoryId: string): Observable<Card[]> {
    const categoryCardsCollection = query(this.cardsCollection, where('categoryId', '==', categoryId));
    return collectionData(categoryCardsCollection, { idField: 'id' }) as Observable<Card[]>;
  }

  getCardById(id: string): Observable<Card> {
    const cardDoc = doc(this.firestore, `cards/${id}`);
    return docData(cardDoc, { idField: 'id' }) as Observable<Card>;
  }

  addCard(card: Card) {
    return addDoc(this.cardsCollection, card);
  }

  updateCard(id: string, card: Partial<Card>): Promise<void> {
    const cardDoc = doc(this.firestore, `cards/${id}`);
    return updateDoc(cardDoc, card);
  }

  deleteCard(id: string): Promise<void> {
    const cardDoc = doc(this.firestore, `cards/${id}`);
    return deleteDoc(cardDoc);
  }
}