// categories.service.ts
import { Injectable } from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc, DocumentData, CollectionReference, where, query, getDocs
} from '@angular/fire/firestore';
import { Category } from '../models/categories.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    private categoriesCollection;
    categoriesCollectionRef: CollectionReference<DocumentData>;


    constructor(private firestore: Firestore) {
        this.categoriesCollection = collection(this.firestore, 'categories');
    }

    // CRUD-Operationen für Kategorien
    /*getAllCategories(): Observable<Category[]> {
        return collectionData(this.categoriesCollection, { idField: 'id' }) as Observable<Category[]>;
    }*/

    //changed Syntax
    getAllCategories(): Observable<Category[]> {
        return collectionData(this.categoriesCollection) as Observable<Category[]>;
    }


    /*getCategoryById(id: string): Observable<Category> {
        const categoryDoc = doc(this.firestore, `categories/${id}`);
        return docData(categoryDoc, { idField: 'id' }) as Observable<Category>;
    }*/

    async getCategoryById(id: string): Promise<Category | null> {
        const categoryRef = doc(this.firestore, `categories/${id}`);
        const categorySnap = await getDoc(categoryRef);

        if (categorySnap.exists()) {
            const category = categorySnap.data() as Category;
            // Hier können Sie Manipulationen oder Anpassungen an der Kategorie vornehmen
            return {
                ...category,
                // Beispiel: imagePath hinzufügen
                imagePath: `assets/images/categories/${category.imagePath}`
            };
        } else {
            return null;
        }
    }

    async getCategoryByName(name: string): Promise<Category | null> {
        const filterQuery = query(this.categoriesCollectionRef, where('name', '==', name));

        try {
            const querySnapshot = await getDocs(filterQuery);

            if (!querySnapshot.empty) {
                const categoryDoc = querySnapshot.docs[0];
                const category = categoryDoc.data() as Category;

                // Hier können Sie Manipulationen oder Anpassungen an der Kategorie vornehmen
                return {
                    ...category,
                    imagePath: `assets/images/categories/${category.imagePath}`
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting category by name:', error);
            return null;
        }
    }

    async addCategory(category: Category): Promise<void> {
        await addDoc(this.categoriesCollection, { name: category.name, questionCount: 0 });
    }

    async updateCategory(id: string, category: Partial<Category>): Promise<void> {
        const categoryDoc = doc(this.firestore, `categories/${id}`);
        await updateDoc(categoryDoc, category);
    }

    async deleteCategory(id: string): Promise<void> {
        const categoryDoc = doc(this.firestore, `categories/${id}`);
        await deleteDoc(categoryDoc);
    }

}