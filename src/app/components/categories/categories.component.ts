import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collectionData, collection, addDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {
  IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol,
  IonContent, IonFab, IonFabButton,
  IonFooter, IonGrid,
  IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList,
  IonNav, IonRippleEffect, IonRow,
  IonSegment, IonTabBar, IonTabButton, IonTabs,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  standalone: true,
  styleUrls: ['./categories.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonContent,
    IonFooter,
    IonSegment,
    IonNav,
    IonToolbar,
    IonTitle,
    IonFab,
    IonFabButton,
    IonIcon,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonButton,
    IonRippleEffect,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonGrid,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonLabel,
    IonInput
  ]
})
export class CategoriesComponent implements OnInit {

  categories$: Observable<any[]>;

  constructor(private router: Router, private firestore: Firestore) {
    const collectionRef = collection(this.firestore, 'categories');
    this.categories$ = collectionData(collectionRef, { idField: 'id' });
  }

  ngOnInit() {
    console.log('CategoriesComponent initialized');
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

  addCategory(name: string) {
    if (name) { // Ensure name is not empty or undefined
      const collectionRef = collection(this.firestore, 'categories');
      addDoc(collectionRef, { name: name }).then(() => {
        console.log('Category added successfully');
      }).catch((error) => {
        console.error('Error adding category: ', error);
      });
    } else {
      console.warn('Category name is empty or undefined');
    }
  }

  getCardsForCategory(categoryId: string): Observable<any[]> {
    const collectionRef = collection(this.firestore, `categories/${categoryId}/cards`);
    return collectionData(collectionRef, { idField: 'id' });
  }

  addCardToCategory(categoryName: string, question: string, answers: string[], correctAnswer: string) {
    if (categoryName && question && answers && correctAnswer) { // Ensure all values are not empty or undefined
      console.log(`Kategorie: ${categoryName}, Frage: ${question}, Antworten: ${answers}, Richtige Antwort: ${correctAnswer}`);
      // Implement logic to add card to category
    } else {
      console.warn('One or more values are empty or undefined');
    }
  }
}

// Initialize Firebase
// const app = initializeApp(environment.firebaseConfig);
// const firestore = getFirestore(app);
