// categories.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Category } from '../models/categories.model';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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