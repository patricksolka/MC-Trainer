import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'homeComponent',
    loadComponent: () => import('./components/home/home.component').then( m => m.HomeComponent)
  }
];

