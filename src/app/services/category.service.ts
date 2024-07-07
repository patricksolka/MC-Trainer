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

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private cardsCollection: CollectionReference<Card>;
    public categories: Category[];
    public filteredCategories: Category[] = [];
    public completedCategories: Category[] = [];
    public pendingCategories: Category[] = [];

    public searchCategory: string = '';
    public startTime: Date |null = null;

    categoriesCollectionRef: CollectionReference<DocumentData>;

    constructor(private firestore: Firestore, private router: Router, private userService: UserService,
                private alertController: AlertController, private authService: AuthService) {
        this.categoriesCollectionRef = collection(firestore, 'categories');
        this.cardsCollection = collection(firestore, 'cards') as CollectionReference<Card>;
        this.filteredCategories = this.categories;
    }




    getAllCardsForCategory(categoryId: string): Observable<Card[]> {
        const categoryCardsQuery = query(this.cardsCollection, where('categoryId', '==', categoryId));
        return collectionData(categoryCardsQuery, {idField: 'id'}) as Observable<Card[]>;
    }

    // get category by id -> Wird nicht verwendet: Maybe löschen?
    /*
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
    } */

    //get all categories
    async getCategories(): Promise<Category[] | null> {
        try {
            const filterQuery = query(this.categoriesCollectionRef, orderBy('name'));
            const refWithConverter = filterQuery.withConverter(this.categoryConverter);

            onSnapshot(refWithConverter, (snapshot) => {
                snapshot.docs.forEach(docData => {
                   // console.log(docData.data());
                });
            });

            const categoryDocs = await getDocs(refWithConverter);
            const categories: Category[] = [];
            categoryDocs.forEach(categoryDoc => {
                categories.push(this.categoryConverter.fromFirestore(categoryDoc, {}));
            });
            this.categories = categories;
            this.filteredCategories = categories;

            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return null;
        }
    }
    // Get Categories by Id:
    async getCategoryById(categoryId: string): Promise<Category> {
        const categoryDoc = doc(this.firestore, `categories/${categoryId}`);
        const categorySnapshot = await getDoc(categoryDoc);
        return categorySnapshot.data() as Category;
    }

    async resetCardAnsweredCounter(cardid: string, counter: string) {
        const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/answers/${cardid}`);
        const newCount = 0;
        await updateDoc(userDoc, {
            [`${counter}`]: newCount
        });
    }

    resetCardCounterForCategory(categoryId: string): void {
        const cards = this.getAllCardsForCategory(categoryId);
        const cardsSubscription = cards.subscribe(
            async (cards) => {
                if (cards.length > 0) {
                    for(const card of cards){
                        this.resetCardAnsweredCounter(card.id, "counter");
                    }
                } else {
                    console.warn('Keine Karten gefunden für die Kategorie mit ID:', categoryId);
                }
            },
            (error) => {
                console.error('Fehler beim Laden der Karten:', error);
            }
        );
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

    async startQuiz(categoryId: string) {
        if (categoryId) {
            const result = await this.isDone(categoryId);
            if(result == false) {
                this.startTime = new Date();
                console.log('Service Quiz started at:', this.startTime);
                await this.router.navigate(['/cards', categoryId]);
            } else {
                //TODO
                await this.showNoTasksAlert(categoryId); // Übergebe categoryId, um den Fortschritt
                // zurückzusetzen
                console.log("Nichts zu tun!");
            }
        } else {
            console.error('Invalid categoryId:', categoryId);
        }
    }

    async showNoTasksAlert(categoryId: string) {
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
        await this.setDone(categoryId, "done", false);
        await this.resetCardCounterForCategory(categoryId);
        console.log(`Progress for category ${categoryId} has been reset.`);
    }

    async setDone(categoryId: string, attribute: string, done: boolean): Promise<void>{
        const userDoc = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/categories/${categoryId}`);
        const val = done;
        await updateDoc(userDoc, {
            [`${attribute}`]: val
        });
    }

    async isDone(categoryId: string): Promise<boolean> {
        const docRef = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/categories/${categoryId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            /*const counter = data?.['counter'] || 0;
            return counter;*/
            return data['done'] || false;
        } else {
            await setDoc(docRef, {done: false});
            return false;
        }
    }

    filterCategories() {
        const searchQuery = this.searchCategory.toLowerCase();
        this.completedCategories = this.categories.filter(category =>
            category.done && category.name.toLowerCase().includes(searchQuery)
        );
        this.pendingCategories = this.categories.filter(category =>
            !category.done && category.name.toLowerCase().includes(searchQuery)
        );
    }
}