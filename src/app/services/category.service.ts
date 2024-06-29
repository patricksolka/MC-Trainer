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
    orderBy, onSnapshot, getDocs, Unsubscribe
} from '@angular/fire/firestore';
import { Category } from '../models/categories.model';

import {Router} from "@angular/router";
import {Storage} from "@angular/fire/storage";
import {UserService} from "./user.service";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    public categories: Category[];
    public startTime: Date |null = null;

    categoriesCollectionRef: CollectionReference<DocumentData>;

    constructor(private firestore: Firestore, private router: Router, private userService: UserService) {
        this.categoriesCollectionRef = collection(firestore, 'categories');
    }

    // In CategoryService


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
    async getCategories(): Promise<Category[] | null> {
        try {
            const filterQuery = query(this.categoriesCollectionRef, orderBy('name'));
            const refWithConverter = filterQuery.withConverter(this.categoryConverter);

            // Subscribe to real-time updates (optional)
            onSnapshot(refWithConverter, (snapshot) => {
                snapshot.docs.forEach(docData => {
                   // console.log(docData.data());
                });
            });

            // Fetch categories once
            const categoryDocs = await getDocs(refWithConverter);
            const categories: Category[] = [];
            categoryDocs.forEach(categoryDoc => {
                categories.push(this.categoryConverter.fromFirestore(categoryDoc, {}));
            });

            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return null;
        }
    }

    /*getCategories(): Observable<Category[]> {
        return new Observable<Category[]>(observer => {
            const filterQuery = query(this.categoriesCollectionRef, orderBy('name'));
            const refWithConverter = filterQuery.withConverter(this.categoryConverter);

            const unsubscribe = onSnapshot(refWithConverter, (snapshot) => {
                const categories: Category[] = [];
                snapshot.docs.forEach(doc => {
                    categories.push(doc.data());
                });
                observer.next(categories);
            }, error => {
                observer.error(error);
            });

            // Provide a way of canceling and disposing the source
            return unsubscribe;
        });
    }*/

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

    startQuiz(categoryId: string) {
        if (categoryId) {
            this.startTime = new Date();
            console.log('Service Quiz started at:', this.startTime);
            this.router.navigate(['/cards', categoryId]);
        } else {
            console.error('Invalid categoryId:', categoryId);
        }

    }

  /* async endQuiz(userId: string, categoryId: string, cardId: string) {
       const endTime = new Date();
       await this.userService.addLearningSession(userId, categoryId, cardId, this.startTime, endTime);
       this.startTime = null; // Reset der Startzeit
     } */
     

    /*async addFavCategory(uid: string, categoryId: string): Promise<void> {
        try {
            // Hier könnte zusätzliche Logik hinzugefügt werden, bevor die Kategorie hinzugefügt wird
            await this.userService.addFavUser(uid, categoryId);
            console.log(`Category ${categoryId} added to favorites for user ${uid}`);
        } catch (error) {
            console.error('Error adding category to favorites:', error);
            throw error; // Fehler weitergeben, falls nötig
        }
    }*/


    /*async addCategory(category: Category): Promise<void> {
        await addDoc(this.categoriesCollectionRef, { name: category.name, questionCount: 0 });
    }

    async updateCategory(id: string, category: Partial<Category>): Promise<void> {
        const categoryDoc = doc(this.firestore, `categories/${id}`);
        await updateDoc(categoryDoc, category);
    }

    async deleteCategory(id: string): Promise<void> {
        const categoryDoc = doc(this.firestore, `categories/${id}`);
        await deleteDoc(categoryDoc);
    }*/



}