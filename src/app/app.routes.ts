import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then( m => m.HomeComponent)
  },
  {
    path: 'cards',
    loadComponent: () => import('./components/card/card.component').then( m => m.CardComponent)
  },
  {
    path: 'stats',
    loadComponent: () => import('./components/stats/stats.component').then( m => m.StatsComponent)
  },
  {
    path: 'achievements',
    loadComponent: () => import('./components/achievements/achievements.component').then( m => m.AchievementsComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./page/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registration',
    loadComponent: () => import('./page/registration/registration.page').then( m => m.RegistrationPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./page/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },

];
