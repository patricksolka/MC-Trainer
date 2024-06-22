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
    getDoc, DocumentData, CollectionReference,  query,  limit
} from '@angular/fire/firestore';
import { Category } from '../models/categories.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    categoriesCollectionRef: CollectionReference<DocumentData>;


    constructor(private firestore: Firestore) {
        this.categoriesCollectionRef = collection(firestore, 'categories');
    }


    getAllCategories(): Observable<Category[]> {
        return collectionData(this.categoriesCollectionRef) as Observable<Category[]>;
    }

    async getCategoryById(id: string): Promise<Category | null> {
        try {
            const categoryRef = doc(this.firestore, `categories/${id}`);
            const categorySnap = await getDoc(categoryRef);

            if (categorySnap.exists()) {
                const category = categorySnap.data() as Category;
                return {
                    ...category,
                    imagePath: `assets/images/categories/${category.imagePath}`
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching category by id:', error);
            return null;
        }
    }


    //Retrieve the first four categories for Preview
    getPreviewCategories(): Observable<Category[]> {
        const filterQuery = query(this.categoriesCollectionRef, limit(4));
        return collectionData(filterQuery) as Observable<Category[]>;
    }

    async addCategory(category: Category): Promise<void> {
        await addDoc(this.categoriesCollectionRef, { name: category.name, questionCount: 0 });
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