import {Component,ViewChild} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Category} from '../../models/categories.model';
import {CategoryService} from '../../services/category.service';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule} from '@angular/forms';
import {FooterPage} from "../footer/footer.page";
import {ChangeDetectorRef} from "@angular/core";
import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent, IonGrid,
    IonHeader, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel,
    IonList,
    IonRow, IonSearchbar, IonSkeletonText, IonText, IonTitle,
    IonToolbar
} from "@ionic/angular/standalone";


@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, FooterPage, IonCol, IonRow, IonContent, IonHeader, IonToolbar, IonList, IonButtons, IonButton, IonTitle, IonIcon, IonGrid, IonSearchbar, IonText, IonSkeletonText, NgOptimizedImage, IonItemGroup, IonItemDivider, IonItem, IonLabel]
})
export class CategoriesComponent {
    public categories: Category[] | null;
    public loaded: boolean = false;

    searchBarVisible = false;
    #searchBar: IonSearchbar | undefined;


    @ViewChild(IonSearchbar)
    set searchbar(sb: IonSearchbar) {
        if (sb) {
            setTimeout(() => sb.setFocus(), 0);
            this.#searchBar = sb;
        }
    }

    constructor(public categoryService: CategoryService, private router: Router, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
        this.loadCategories();
    }


    async loadCategories():Promise<void> {
        console.log('Ladezustand1', this.loaded);
        try {
            this.loaded = false;
            this.categories = await this.categoryService.getCategories();
            this.loaded = false;
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
                this.categoryService.filterCategories();
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


    categoryHasQuestions(category: Category): boolean {
        return category.questionCount && category.questionCount > 0;
    }

    ionViewWillEnter() {
        this.loadCategories();
    }
}


