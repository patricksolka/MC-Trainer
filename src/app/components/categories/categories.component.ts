// categories.component.ts
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Category} from '../../models/categories.model';
import {CategoriesService} from '../../services/categories.service';
import {Router, RouterLink} from '@angular/router';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup, FormsModule} from '@angular/forms';
import {IonicModule} from "@ionic/angular";
import {FooterPage} from "../footer/footer.page";

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule, RouterLink, FooterPage]
})
export class CategoriesComponent implements OnInit {

    categories$: Observable<Category[]>;
    searchBarVisible = false;
    searchText = '';
    newCategoryName: string = '';
    categoryForm: FormGroup;

    constructor(private categoryService: CategoriesService, private router: Router, private fb: FormBuilder) {
        this.categoryForm = this.fb.group({
            name: ['']
        });
    }

    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories(): void {
        this.categories$ = this.categoryService.getAllCategories();
        this.categories$.subscribe(categories => {
            console.log('Geladene Kategorien:', categories); // Protokollierung hinzufügen
        });
    }

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
        this.router.navigate(['/cards', categoryId]);
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
                this.loadCategories();
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
