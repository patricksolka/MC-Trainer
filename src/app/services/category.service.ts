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
//import { Observable } from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    //private categoriesCollection;
    public categories: Category[];
    categoriesCollectionRef: CollectionReference<DocumentData>;


    constructor(private firestore: Firestore, private router: Router) {
        this.categoriesCollectionRef = collection(firestore, 'categories');
        //this.categoriesCollection = collection(this.firestore, 'categories');
    }

    //TODO: Eigentlich nicht nötig da wir mit fetchCategories() arbeiten
    /*getAllCategories(): Observable<Category[]> {
        try {
            return collectionData(this.categoriesCollectionRef) as Observable<Category[]>;

        } catch (e) {
            console.error('Error fetching categories:', e);
        }
        return null;
    }*/

    /*getAllCategories(): Observable<Category[]> {
        return collectionData(this.categoriesCollection) as Observable<Category[]>;
    }*/
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

    async getCategories(): Promise<Category[] | null> {
        try {
            const filterQuery = query(this.categoriesCollectionRef, orderBy('name'));
            const refWithConverter = filterQuery.withConverter(this.categoryConverter);

            // Subscribe to real-time updates (optional)
            onSnapshot(refWithConverter, (snapshot) => {
                snapshot.docs.forEach(docData => {
                    console.log(docData.data());
                    // Here you can update your component state or do other operations
                });
            });

            // Fetch categories once
            const categoryDocs = await getDocs(refWithConverter);
            const categories: Category[] = [];
            categoryDocs.forEach(categoryDoc => {
                categories.push(categoryDoc.data());
            });
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }



   /* getPreviewCategories(): Observable<Category[]> {
        const filterQuery = query(this.categoriesCollectionRef, limit(10));
        const refWithConverter = filterQuery.withConverter(this.categoryConverter);
        return collectionData(refWithConverter) as Observable<Category[]>;
    }*/
    //Retrieve the first four categories for Preview
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

    startQuiz(categoryId: string) {
        if (categoryId) {
            this.router.navigate(['/cards', categoryId]);
        } else {
            console.error('Invalid categoryId:', categoryId);
            // Handle invalid categoryId case, e.g., show error message or navigate to a default route
        }
    }

}