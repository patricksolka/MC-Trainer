import { Injectable } from '@angular/core';
import {
    Firestore,
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    DocumentData,
    CollectionReference,
    query,
    limit,
    QueryDocumentSnapshot,
    SnapshotOptions,
    orderBy, onSnapshot, getDocs, Unsubscribe, setDoc, where, collectionData
} from '@angular/fire/firestore';
import { Category } from '../models/categories.model';
import { AlertController } from '@ionic/angular'; // Import AlertController

import {Router} from "@angular/router";
import {Storage} from "@angular/fire/storage";
import {UserService} from "./user.service";
import {Card} from "../models/card.model";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {User} from "../models/user.model";
import {TotalStatsService} from "./total-stats.service";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    public categories: Category[];
    public filteredCategories: Category[] = [];
    public completedCategories: Category[] = [];
    public pendingCategories: Category[] = [];


    public searchCategory: string = '';
    public startTime: Date |null = null;

    categoriesCollectionRef: CollectionReference<DocumentData>;
    cardsCollectionRef: CollectionReference<Card>;

    constructor(private firestore: Firestore, private router: Router, private userService: UserService,
                private alertController: AlertController, private authService: AuthService, private ts: TotalStatsService) {

        this.categoriesCollectionRef = collection(firestore, 'categories');
        this.cardsCollectionRef = collection(firestore, 'cards') as CollectionReference<Card>;
    }




    getAllCardsForCategory(categoryId: string): Observable<Card[]> {
        const filterQuery = query(this.cardsCollectionRef, where('categoryId', '==', categoryId));
        return collectionData(filterQuery, {idField: 'id'}) as Observable<Card[]>;
    }

    // get category by id
    async getCategoryById(id: string): Promise<Category | null> {
        try {
            const docRef = doc(this.firestore, 'categories', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                //const category = categorySnap.data() as Category;
                return this.categoryConverter.fromFirestore(docSnap, {});

            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching category by id:', error);
            return null;
        }
    }

    //get all categories
  /*  async getCategories(): Promise<Category[] | null> {
        try {
            const filterQuery = query(this.categoriesCollectionRef, orderBy('name'));
            const refWithConverter = filterQuery.withConverter(this.categoryConverter);

            const categoryDocs = await getDocs(refWithConverter);
            const categories: Category[] = [];

            // Laden der doneCategories des aktuellen Benutzers
            const userDocRef = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}`);
            const doneCategoriesRef = collection(userDocRef, 'categories');
            console.log('doneCategoriesRef:', doneCategoriesRef.path)
            const doneCategoriesSnap = await getDocs(doneCategoriesRef);
            console.log( 'doneCategoriesSnap:', doneCategoriesSnap.docs)


            // Setzen der doneCategories als Map für schnelleren Zugriff
            const userDoneCategories: Map<string, boolean> = new Map();
            doneCategoriesSnap.forEach(doc => {
                const categoryId = doc.id;
                const done = doc.data()['done'];
                console.log('done:', done)
                userDoneCategories.set(categoryId, done);
            });

            categoryDocs.forEach(categoryDoc => {
                const category = categoryDoc.data() as Category;
                category.id = categoryDoc.id;

                // Prüfen, ob die Kategorie als abgeschlossen markiert ist
                //category.done = !!userDoneCategories[category.id];
                category.done = userDoneCategories.get(category.id) || false;

                categories.push(category);
            });

            this.categories = categories;
            this.filterCategories(); // Filterung aktualisieren

            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return null;
        }
    }*/

    async getCategories(): Promise<Category[] | null> {
        try {
            const filterQuery = query(this.categoriesCollectionRef, orderBy('name'));
            const refWithConverter = filterQuery.withConverter(this.categoryConverter);

            const categoryDocs = await getDocs(refWithConverter);
            const categories: Category[] = [];

            // Laden der stats des aktuellen Benutzers
            const userDocRef = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}`);
            const statsRef = collection(userDocRef, 'stats');

            const docSnap = await getDocs(statsRef);
            console.log('statsSnap:', docSnap.docs);

            const userStatsCategories: Map<string, boolean> = new Map();
            docSnap.forEach(doc => {
                const categoryId = doc.id;
                const done = doc.data()['done'];
                console.log('done:', done);
                userStatsCategories.set(categoryId, done);
            });

            categoryDocs.forEach(categoryDoc => {
                const category = categoryDoc.data() as Category;
                category.id = categoryDoc.id;

                // Prüfen, ob die Kategorie als abgeschlossen markiert ist
                category.done = userStatsCategories.get(category.id) || false;

                categories.push(category);
            });

            this.categories = categories;
            this.filterCategories();

            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return null;
        }
    }




    async resetCardAnsweredCounter(cardId: string) {
        try {
            const docRef = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/answers/${cardId}`);

            await deleteDoc(docRef);

            console.log(`Counter for card '${cardId}' reset successfully.`);
        } catch (error) {
            console.error('Error resetting counter:', error);
            throw error; // optional: rethrow the error if needed
        }
    }



    /*resetCardCounter(categoryId: string): void {
        const cards = this.getAllCardsForCategory(categoryId) as Observable<Card[]>;
        const cardsSubscription = cards.subscribe(
            async (cards) => {
                if (cards.length > 0) {
                    for(const card of cards){
                       await this.resetCardAnsweredCounter(card.id);
                    }
                } else {
                    console.warn('Keine Karten gefunden für die Kategorie mit ID:', categoryId);
                }
            },
            (error) => {
                console.error('Fehler beim Laden der Karten:', error);
            }
        );
    }*/

    //Gleiche Funktion wie vorher nur das "subsribe" nicht durchgestrichen ist
    resetCardCounter(categoryId: string): void {
        const cardsObservable = this.getAllCardsForCategory(categoryId) as Observable<Card[]>;

        const subscription = cardsObservable.subscribe({
            next: async (cards) => {
                if (cards.length > 0) {
                    for (const card of cards) {
                        try {
                            await this.resetCardAnsweredCounter(card.id);
                            console.log(`Counter für Karte mit ID '${card.id}' erfolgreich zurückgesetzt.`);
                        } catch (error) {
                            console.error(`Fehler beim Zurücksetzen des Zählers für Karte mit ID ${card.id}:`, error);
                            throw error; // Fehler weiterleiten, um das Haupt-Observable zu unterbrechen
                        }
                    }
                } else {
                    console.warn('Keine Karten gefunden für die Kategorie mit ID:', categoryId);
                }
            },
            error: (error) => {
                console.error('Fehler beim Laden der Karten:', error);
            },
            complete: () => {
                console.log('Reset der Counter für alle Karten abgeschlossen.');
            }
        });

        // Optional: Speichern Sie das Abonnement, um es später zu verwalten oder zu stornieren
        // this.subscriptions.push(subscription);
    }

    // get first 4 categories for Preview
    async getPreviewCategories(): Promise<Category[]> {
        try {
            const filterQuery = query(this.categoriesCollectionRef, limit(4));
            const refWithConverter = filterQuery.withConverter(this.categoryConverter);

            const categoryDocs = await getDocs(refWithConverter);
            const categories: Category[] = [];
            categoryDocs.forEach(categoryDoc => {
                categories.push(categoryDoc.data());
            });
            return categories;
        } catch (error) {
            console.error('Error fetching preview categories:', error);
            return [];
        }
    }

    async startQuiz(categoryId: string) {
        if (categoryId) {
            const result = await this.ts.isDone(categoryId);
            if(result == false) {
                this.startTime = new Date();
                console.log('Service Quiz started at:', this.startTime);
                await this.router.navigate(['/cards', categoryId]);
            } else {
                //TODO
                await this.resetAlert(categoryId);
                console.log("Nichts zu tun!");
            }
        } else {
            console.error('Invalid categoryId:', categoryId);
        }
    }

    async resetAlert(categoryId: string) {
        const alert = await this.alertController.create({
            header: 'Keine Aufgaben',
            message: 'Es gibt nichts zu tun! Möchten Sie den Fortschritt zurücksetzen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    handler: () => {
                        console.log('Reset abgebrochen');
                    }
                },
                {
                    text: 'Zurücksetzen',
                    handler: async () => {
                        await this.resetProgress(categoryId);
                        console.log('Fortschritt zurückgesetzt');
                    }
                }
            ]
        });
        await alert.present();
    }

    async resetProgress(categoryId: string) {
        try {
            await this.ts.setDone(categoryId, false);
            this.resetCardCounter(categoryId);
            console.log(`Fortschritt für Kategorie ${categoryId} wurde zurückgesetzt.`);
        } catch (error) {
            console.error('Fehler beim Zurücksetzen des Fortschritts:', error);
        }
    }

   /* async setDone(categoryId: string, done: boolean): Promise<void> {
        try {
            const docRef = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}`);
            const statsRef = collection(docRef, 'stats');

            // Füge das Dokument für die Kategorie in der Subcollection stats hinzu oder aktualisiere es
            await setDoc(doc(statsRef, categoryId), { done }, { merge: true });
        } catch (error) {
            console.error('Error setting category done status:', error);
            throw error;
        }
    }*/

   /* async isDone(categoryId: string): Promise<boolean> {
        try {
            const docRef = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}`);
            const statsRef = doc(docRef, `stats/${categoryId}`);
            const docSnap = await getDoc(statsRef);

            if (docSnap.exists()) {
                const statsData = docSnap.data();
                console.log('Kategorie ist abgeschlossen:', statsData['done']);
                return statsData['done'] || false;

            }
            return false;
        } catch (error) {
            console.error('Fehler beim Abrufen des Dokuments:', error);
            throw error;
        }
    }*/

    filterCategories() {
        const searchQuery = this.searchCategory.toLowerCase();
        this.filteredCategories = this.categories.filter(category =>
            category.name.toLowerCase().includes(searchQuery)
        );

        this.completedCategories = this.categories.filter(category =>
            category.done && category.name.toLowerCase().includes(searchQuery)
        );
        this.pendingCategories = this.categories.filter(category =>
            !category.done && category.name.toLowerCase().includes(searchQuery)
        );
    }

    // Dokumente in Catgeory-Objekte umwandeln
    private categoryConverter = {
        fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Category => {
            const result = Object.assign(new Category(), snapshot.data(options));
            result.id = snapshot.id;
            return result;
        },
        toFirestore: (category: Category): DocumentData => {
            const copy = {...category};
            delete copy.id;
            return copy;
        }
    };

}