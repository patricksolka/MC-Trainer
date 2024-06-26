import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UserService} from 'src/app/services/user.service';
import {CategoryService} from 'src/app/services/category.service';
import {Category} from 'src/app/models/categories.model';
import {Auth} from '@angular/fire/auth';
import {AuthService} from 'src/app/services/auth.service';
import {
    IonBackButton, IonButton,
    IonButtons, IonContent,
    IonHeader, IonIcon,
    IonItem, IonList,
    IonTitle,
    IonToolbar
} from "@ionic/angular/standalone";
import {RouterLink} from "@angular/router";
import {from, Observable} from "rxjs";



@Component({
    selector: 'app-meine-module',
    templateUrl: './meine-module.components.html',
    styleUrls: ['./meine-module.components.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, IonHeader, IonToolbar, IonButtons, IonBackButton, IonItem, IonTitle, IonButton, IonIcon, IonContent, IonList]
})
export class MeineModuleComponents {
    /*categories$: Observable<Category[] | null>;
    favoriteModules: Category[] = [];
    searchVisible: boolean = false;
    searchTerm: string = '';*/

    //favCategories: Category[] = [];
    favCategories:{id: string}[] = [];
    categories: Category[] =[];

    constructor(
        private userService: UserService,
        private categoryService: CategoryService,
        private auth: Auth,
        private authService: AuthService
    ) {
        this.loadCategories();
        this.loadFavorites(this.authService.auth.currentUser.uid);
    }


    async loadCategories(): Promise<void> {
        try {
            this.categories = await this.categoryService.getCategories(); // Lade die Kategorien vom Service
            console.log('Categories loaded:', this.categories); // Hier werden die Kategorien in der Konsole ausgegeben
        } catch (error) {
            console.error('Error loading categories:', error);
            // Handle error loading categories, z.B. durch Anzeige einer Fehlermeldung
        }
    }

    async loadFavorites(uid: string) {
        try {
            this.favCategories = await this.userService.getFavoriteModules(uid);
            console.log('Favorite categories loaded:', this.favCategories);
        } catch (error) {
            console.error('Error loading favorite modules:', error);
        }
    }


    async addFavorite(categoryId: string) {
        try {
            const user = this.auth.currentUser;
            if(user){
            await this.userService.addFavUser(user.uid, categoryId);
            console.log(`Category ${categoryId} added to favorites.`);
            this.favCategories = await this.userService.getFavoriteModules(user.uid);
            } else{
                console.error('User is not logged in or user data is not loaded yet.');
            }
            // Optional: Aktualisieren Sie die Ansicht, um die Änderungen zu reflektieren
        } catch (error) {
            console.error('Error adding category to favorites:', error);
        }
    }

    async removeFavorite(categoryId: string) {
        try {
            await this.userService.removeFav(this.userService.user.uid, categoryId);
            console.log(`Category ${categoryId} removed from favorites.`);
            // Optional: Aktualisieren Sie die Ansicht, um die Änderungen zu reflektieren
        } catch (error) {
            console.error('Error removing category from favorites:', error);
        }
    }


    /*ngOnInit(): void {
      this.loadCategories();
    }


    loadCategories(): void {
      this.categories$ = this.categoryService.getCategories();
      this.categories$.subscribe(categories => {
        if (categories) {
          this.loadFavoriteModules();
        }
      });
    }

    /!*loadFavoriteModules(categories: Category[]): void {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        this.userService.getFavoriteModules(currentUser.uid).then(favoriteModuleIds => {
          console.log('Favorite Module IDs:', favoriteModuleIds); // Hier wird der console.log hinzugefügt
          this.favoriteModules = categories.filter(category =>
              favoriteModuleIds.includes(category.id)
          );
        });
      }
    }*!/

    loadFavoriteModules(): void {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        this.userService.getFavoriteModules(currentUser.uid).then(favoriteModuleIds => {
          console.log('Favorite Module IDs:', favoriteModuleIds); // Hier wird der console.log hinzugefügt
          this.categoryService.getCategories().subscribe(categories => {
            if (categories) {
              this.favoriteModules = categories.filter(category =>
                  favoriteModuleIds.includes(category.id)
              );
            }
          });
        });
      }
    }

    /!*async addToFavorites(categoryId: string): Promise<void> {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        await this.userService.addFavoriteModule(currentUser.uid, categoryId);
        const timestamp = Date.now();
        // Update local state
        this.favoriteModules.push({ id: categoryId, timestamp });
      }
    }*!/

    /!*async addToFavorites(categoryId: string): Promise<void> {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        await this.userService.addFavoriteModule(currentUser.uid, categoryId);
        const timestamp = Date.now();

        // Retrieve the full category object from your service or wherever it's available
        const category = await this.categoryService.getCategoryById(categoryId);

        // Ensure category is not null or undefined
        if (category) {
          // Create a new Category object with id and timestamp
          const favoriteModule: Category = {
            id: categoryId,
            name: category.name,  // Assuming these properties exist on Category
            timestamp: timestamp
          };

          // Update local state
          this.favoriteModules.push(favoriteModule);
        }
      }
    }
  *!/
    async addToFavorites(categoryId: string): Promise<void> {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        await this.userService.addFavoriteModule(currentUser.uid, categoryId);
        const category = await this.categoryService.getCategoryById(categoryId);
        if (category) {
          // Create a new Category object with id, name and timestamp
          const favoriteModule: Category = {
            id: categoryId,
            name: category.name,  // Assuming these properties exist on Category
            timestamp: Date.now()
          };
          // Update local state
          this.favoriteModules.push(favoriteModule);
        }
      }
    }

    async removeFromFavorites(categoryId: string): Promise<void> {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        await this.userService.removeFavoriteModule(currentUser.uid, categoryId);
        // Update local state
        this.favoriteModules = this.favoriteModules.filter(module => module.id !== categoryId);
      }
    }

    toggleSearch(): void {
      this.searchVisible = !this.searchVisible;
      if (!this.searchVisible) {
        this.searchTerm = '';
      }
    }*/

}