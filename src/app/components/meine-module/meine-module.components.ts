import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/categories.model';
import { Auth } from '@angular/fire/auth';
import {IonicModule} from "@ionic/angular";
import {RouterLink} from "@angular/router";
import {from, Observable} from "rxjs";


@Component({
  selector: 'app-meine-module',
  templateUrl: './meine-module.components.html',
  styleUrls: ['./meine-module.components.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule, RouterLink]
})
export class MeineModuleComponents {
  //categories: Category[] = [];
  categories: Observable<Category[] | null>;
  favoriteModules: Category[] = [];
  filteredCategories: Category[] = [];
  searchVisible: boolean = false;
  searchTerm: string = '';
  favoriteModuleIds: { id: string, timestamp: number }[] = []; // Define favoriteModuleIds

  constructor(
      private userService: UserService,
      private categoryService: CategoryService,
      private auth: Auth
  ) {
    this.loadCategories();
    //this.loadFavoriteModules();
  }

 /* async loadCategories() {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      //this.updateFilteredCategories();
    });
  }*/

  async loadFavoriteModules(categories: Category[]) {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      this.userService.getFavoriteModules(currentUser.uid).then(favoriteModuleIds => {
        this.favoriteModuleIds = favoriteModuleIds; // Assign the favoriteModuleIds
        this.favoriteModules = categories.filter(category =>
            this.favoriteModuleIds.some(fav => fav.id === category.id)
        );
      });
    }
  }

  async loadCategories() {
    this.categories = from(this.categoryService.fetchCategories());
    this.categories.subscribe(categories => {
      this.loadFavoriteModules(categories);
    });
  }

  async addToFavorites(categoryId: string) {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      await this.userService.addFavoriteModule(currentUser.uid, categoryId);
      this.categories.subscribe(categories => {
        this.loadFavoriteModules(categories);
      });
    }
  }

 /* updateFilteredCategories() {
    this.filteredCategories = this.categories.filter(category =>
        !this.favoriteModules.find(fav => fav.id === category.id)
    );
  }*/

  toggleSearch() {
    this.searchVisible = !this.searchVisible;
    if (!this.searchVisible) {
      this.searchTerm = '';
      //this.filterCategories();
    }
  }

  /*filterCategories() {
    if (this.searchTerm.trim() === '') {
      //this.updateFilteredCategories();
    } else {
      this.filteredCategories = this.categories.filter(category =>
          !this.favoriteModules.find(fav => fav.id === category.id) &&
          category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }*/
}