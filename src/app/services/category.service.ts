/**
 * @fileoverview Diese Datei enthält den CategoryService, der die Verwaltung und Operationen von Kategorien übernimmt.
 */
import { Injectable } from '@angular/core';
import {
    Firestore,
    collection,
    doc,
    deleteDoc,
    getDoc,
    DocumentData,
    CollectionReference,
    query,
    limit,
    QueryDocumentSnapshot,
    SnapshotOptions,
    orderBy, getDocs, where, collectionData
} from '@angular/fire/firestore';
import { Category } from '../models/categories.model';
import { AlertController } from '@ionic/angular';
import {Router} from "@angular/router";
import {UserService} from "./user.service";
import {Card} from "../models/card.model";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {TotalStatsService} from "./total-stats.service";

/**
 * @class CategoryService
 * @description Dieser Service verwaltet die Kategorieoperationen und Interaktionen mit Firestore.
 */
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

    /**
     * @constructor
     * @param {Firestore} firestore - Firebase Firestore-Instanz.
     * @param {Router} router - Router zum Navigieren zwischen Seiten.
     * @param {UserService} userService - Service für Benutzeroperationen.
     * @param {AlertController} alertController - Controller für Alerts.
     * @param {AuthService} authService - Service für Authentifizierungsoperationen.
     * @param ts
     */
    constructor(private firestore: Firestore, private router: Router, private userService: UserService,
                private alertController: AlertController, private authService: AuthService, private ts: TotalStatsService) {

        this.categoriesCollectionRef = collection(firestore, 'categories');
        this.cardsCollectionRef = collection(firestore, 'cards') as CollectionReference<Card>;
    }

    /**
     * @method getAllCardsForCategory
     * @description Holt alle Karten für eine bestimmte Kategorie.
     * @param {string} categoryId - Die ID der Kategorie.
     * @returns {Observable<Card[]>} - Ein Observable mit den Karten.
     */
    getAllCardsForCategory(categoryId: string): Observable<Card[]> {
        const filterQuery = query(this.cardsCollectionRef, where('categoryId', '==', categoryId));
        return collectionData(filterQuery, {idField: 'id'}) as Observable<Card[]>;
    }

    /**
     * @method getCategories
     * @description Holt alle Kategorien aus Firestore.
     * @returns {Promise<Category[] | null>} - Eine Liste von Kategorien oder null bei einem Fehler.
     */
    async getCategories(): Promise<Category[] | null> {
        try {
            const filterQuery = query(this.categoriesCollectionRef, orderBy('name'));
            const refWithConverter = filterQuery.withConverter(this.categoryConverter);

            const categoryDocs = await getDocs(refWithConverter);
            const categories: Category[] = [];

            const userDocRef = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}`);
            const statsRef = collection(userDocRef, 'stats');

            const docSnap = await getDocs(statsRef);
            const userStatsCategories: Map<string, boolean> = new Map();
            docSnap.forEach(doc => {
                const categoryId = doc.id;
                const done = doc.data()['done'];
                userStatsCategories.set(categoryId, done);
            });

            categoryDocs.forEach(categoryDoc => {
                const category = categoryDoc.data() as Category;
                category.id = categoryDoc.id;
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
    /**
     * @method getCategoryById
     * @description Holt eine Kategorie anhand ihrer ID aus Firestore.
     * @param {string} categoryId - Die ID der Kategorie.
     * @returns {Promise<Category>} - Die Kategorie.
     */
    async getCategoryById(categoryId: string): Promise<Category> {
        const categoryDoc = doc(this.firestore, `categories/${categoryId}`);
        const categorySnapshot = await getDoc(categoryDoc);
        return categorySnapshot.data() as Category;
    }
    /**
     * @method resetCardAnsweredCounter
     * @description Setzt den Zähler für beantwortete Fragen einer Karte zurück.
     * @param cardId
     */
    async resetCardAnsweredCounter(cardId: string) {
        try {
            const docRef = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}/answers/${cardId}`);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error resetting counter:', error);
            throw error;
        }
    }
    /**
     * @method resetCardCounterForCategory
     * @description Setzt den Zähler für alle Karten einer Kategorie zurück.
     * @param {string} categoryId - Die ID der Kategorie.
     */
    resetCardCounter(categoryId: string): void {
        const cardsObservable = this.getAllCardsForCategory(categoryId) as Observable<Card[]>;

        const subscription = cardsObservable.subscribe({
            next: async (cards) => {
                if (cards.length > 0) {
                    for (const card of cards) {
                        try {
                            await this.resetCardAnsweredCounter(card.id);
                        } catch (error) {
                            console.error(`Fehler beim Zurücksetzen des Zählers für Karte mit ID ${card.id}:`, error);
                            throw error;
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

    }
    /**
     * @method getPreviewCategories
     * @description Holt die ersten vier Kategorien für eine Vorschau.
     * @returns {Promise<Category[]>} - Eine Liste der ersten vier Kategorien.
     */
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

    /**
     * @method startQuiz
     * @description Startet ein Quiz für eine Kategorie.
     * @param {string} categoryId - Die ID der Kategorie.
     */
    async startQuiz(categoryId: string) {
        if (categoryId) {
            const result = await this.ts.isDone(categoryId);
            if(result == false) {
                this.startTime = new Date();
                console.log('Service Quiz started at:', this.startTime);
                await this.router.navigate(['/cards', categoryId]);
            } else {
                await this.resetAlert(categoryId);
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

    /**
     * @method resetProgress
     * @description Setzt den Fortschritt für eine Kategorie zurück.
     * @param {string} categoryId - Die ID der Kategorie.
     */
    async resetProgress(categoryId: string) {
        try {
            await this.ts.setDone(categoryId, false);
            this.resetCardCounter(categoryId);
            console.log(`Fortschritt für Kategorie ${categoryId} wurde zurückgesetzt.`);
        } catch (error) {
            console.error('Fehler beim Zurücksetzen des Fortschritts:', error);
        }
    }

    /**
     * @method filterCategories
     * @description Filtert die Kategorien basierend auf dem Suchbegriff.
     */
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