import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/models/categories.model';
import { Auth } from '@angular/fire/auth';
import {IonicModule} from "@ionic/angular";
import {RouterLink} from "@angular/router";
import {CategoryService} from "../../../../../../src/app/services/category.service";

@Component({
  selector: 'app-meine-module',
  templateUrl: './meine-module.components.html',
  styleUrls: ['./meine-module.components.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule, RouterLink]
})
export class MeineModuleComponents {
  categories: Category[] = [];
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
    //this.loadCategories();
    //this.loadFavoriteModules();
  }

  /*async loadCategories() {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      this.updateFilteredCategories();
    });
  }

  async loadFavoriteModules() {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      this.userService.getFavoriteModules(currentUser.uid).then(favoriteModuleIds => {
        this.favoriteModuleIds = favoriteModuleIds; // Assign the favoriteModuleIds
        this.favoriteModules = this.categories.filter(category =>
            this.favoriteModuleIds.some(fav => fav.id === category.id)
        );
        this.updateFilteredCategories();
      });
    }
  }
*/
  async addToFavorites(categoryId: string) {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      await this.userService.addFavoriteModule(currentUser.uid, categoryId);
      //this.loadFavoriteModules();
    }
  }

  updateFilteredCategories() {
    this.filteredCategories = this.categories.filter(category =>
        !this.favoriteModules.find(fav => fav.id === category.id)
    );
  }

  toggleSearch() {
    this.searchVisible = !this.searchVisible;
    if (!this.searchVisible) {
      this.searchTerm = '';
      this.filterCategories();
    }
  }

  filterCategories() {
    if (this.searchTerm.trim() === '') {
      this.updateFilteredCategories();
    } else {
      this.filteredCategories = this.categories.filter(category =>
          !this.favoriteModules.find(fav => fav.id === category.id) &&
          category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
}