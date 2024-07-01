// categories.component.ts
import {Component, ViewChild} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Category} from '../../models/categories.model';
import {CategoryService} from '../../services/category.service';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormsModule} from '@angular/forms';
import {FooterPage} from "../footer/footer.page";
import {from, Observable, tap} from "rxjs";
import {ChangeDetectorRef} from "@angular/core";
import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent, IonGrid,
    IonHeader, IonIcon,
    IonList,
    IonRow, IonSearchbar, IonSkeletonText, IonText, IonTitle,
    IonToolbar
} from "@ionic/angular/standalone";


@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, FooterPage, IonCol, IonRow, IonContent, IonHeader, IonToolbar, IonList, IonButtons, IonButton, IonTitle, IonIcon, IonGrid, IonSearchbar, IonText, IonSkeletonText, NgOptimizedImage]
})
export class CategoriesComponent {
    //TODO: Fix Observable vs Promise handling
    //categories$: Observable<Category[] | null>;

    categories: Category[] | null;
    searchBarVisible = false;
    #searchBar: IonSearchbar | undefined;
    public loaded: boolean = false;

    @ViewChild(IonSearchbar)
    set searchbar(sb: IonSearchbar) {
        if (sb) {
            setTimeout(() => sb.setFocus(), 0);
            this.#searchBar = sb;
        }
    }

    //public imageLoaded: boolean;

    constructor(public categoryService: CategoryService, private router: Router, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
        this.loadCategories();
    }

    toggleSeach(){
        this.searchBarVisible = !this.searchBarVisible;
        if (this.searchBarVisible) {
            setTimeout(() => {
                this.#searchBar?.setFocus();
            }, 1);
        } else {
            this.categoryService.searchCategory = '';
            this.categoryService.filterCategories();
        }
    }

    async loadCategories(): Promise<void> {
        console.log('Ladezustand1', this.loaded);
        try {
            this.loaded = false;
            this.categories = await this.categoryService.getCategories();
            this.categories.forEach(category => category.imageLoaded = false);

            const imageLoaded = this.categories.map(category =>
                new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        category.imageLoaded = true;
                        resolve();
                    };
                    img.onerror = (error) => {
                        console.error(`Fehler beim Laden des Bildes für Kategorie ${category.id}:`, error);
                        reject(error);
                    };
                    img.src = category.imagePath;
                })
            );

            await Promise.all(imageLoaded);

            if (imageLoaded) {
                this.loaded = true;
                console.log('Ladezustand2', this.loaded);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            this.loaded = true;
        }
    }



    toggleSearch() {
        this.searchBarVisible = !this.searchBarVisible;
        if (this.searchBarVisible) {
            setTimeout(() => {
                this.#searchBar?.setFocus();
            }, 1);
        } else {
            this.categoryService.searchCategory = '';
            this.categoryService.filterCategories();
        }
    }

    shareRecords() {
        // Implementiere deine Funktion hier
    }

    navigateHome() {
        // Implementiere deine Funktion hier
    }

    selectCategory(categoryId: string) {
        if (categoryId) {
            this.router.navigate(['/cards', categoryId]);
        } else {
            console.error('Invalid categoryId:', categoryId);
            // Handle invalid categoryId case, e.g., show error message or navigate to a default route
        }
    }


    /*addCategory(newCategoryName: string): void {
        if (newCategoryName.trim() !== '') {
            const newCategory: Category = {
                id: '',
                name: newCategoryName,
                lastViewed: Date.now() // Add the lastViewed property
            };
            this.categoryService.addCategory(newCategory).then(() => {
                this.newCategoryName = '';
                //this.loadCategories();
            }).catch(error => {
                console.error('Error adding category:', error);
            });
        } else {
            console.warn('Category name cannot be empty');
        }
    }*/


    categoryHasQuestions(category: Category): boolean {
        return category.questionCount && category.questionCount > 0;
    }

    /*ionImgDidLoad(categoryId: string) {
        //this.loadCategories();
    console.log('Image loaded');
    const category = this.categories.find(c => c.id === categoryId);
    if (category) {
        category.imageLoaded = true;
        this.imageLoaded = true;
    }
    }*/
}


