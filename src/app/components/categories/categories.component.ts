// categories.component.ts
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Category} from '../../models/categories.model';
import {CategoryService} from '../../services/category.service';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule} from '@angular/forms';
import {FooterPage} from "../footer/footer.page";
import {from, Observable} from "rxjs";
import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent, IonGrid,
    IonHeader, IonIcon,
    IonList,
    IonRow, IonSearchbar, IonText, IonTitle,
    IonToolbar
} from "@ionic/angular/standalone";


@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, FooterPage, IonCol, IonRow, IonContent, IonHeader, IonToolbar, IonList, IonButtons, IonButton, IonTitle, IonIcon, IonGrid, IonSearchbar, IonText]
})
export class CategoriesComponent implements OnInit {
    //TODO: Fix Observable vs Promise handling
    //categories$: Observable<Category[] | null>;
    categories: Observable<Category[] | null>;
    searchBarVisible = false;
    searchText = '';
    newCategoryName: string = '';
    categoryForm: FormGroup;

    constructor(public categoryService: CategoryService, private router: Router, private fb: FormBuilder) {
        this.loadCategories();
        this.categoryForm = this.fb.group({
            name: ['']
        });
    }

    ngOnInit(): void {
        //this.loadCategories();
    }

    loadCategories(): void {
        this.categories = from(this.categoryService.fetchCategories());
    }

    /*loadCategories(): void {
        this.categories$ = this.categoryService.getAllCategories();
        this.categories$.subscribe(categories => {
            console.log('Geladene Kategorien:', categories); // Protokollierung hinzufügen
        });
    }*/

    toggleSearch() {
        this.searchBarVisible = !this.searchBarVisible;
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



    addCategory(newCategoryName: string): void {
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
    }


    categoryHasQuestions(category: Category): boolean {
        return category.questionCount && category.questionCount > 0;
    }

}
