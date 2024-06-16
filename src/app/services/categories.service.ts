// categories.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Category } from '../models/categories.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    private categoriesCollection;

    constructor(private firestore: Firestore) {
        this.categoriesCollection = collection(this.firestore, 'categories');
    }

    // CRUD-Operationen für Kategorien
    getAllCategories(): Observable<Category[]> {
        return collectionData(this.categoriesCollection, { idField: 'id' }) as Observable<Category[]>;
    }

    getCategoryById(id: string): Observable<Category> {
        const categoryDoc = doc(this.firestore, `categories/${id}`);
        return docData(categoryDoc, { idField: 'id' }) as Observable<Category>;
    }

    addCategory(category: Category): Promise<void> {
        return addDoc(this.categoriesCollection, { name: category.name }).then(() => {});
    }

    updateCategory(id: string, category: Partial<Category>): Promise<void> {
        const categoryDoc = doc(this.firestore, `categories/${id}`);
        return updateDoc(categoryDoc, category);
    }

    deleteCategory(id: string): Promise<void> {
        const categoryDoc = doc(this.firestore, `categories/${id}`);
        return deleteDoc(categoryDoc);
    }
}