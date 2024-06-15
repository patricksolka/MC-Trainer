import { Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from "@angular/fire/auth-guard";

const redirectUnauthorizedToLogin = () => {
  return redirectUnauthorizedTo(['login']);
};

const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.page').then(m => m.LoginPage),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/registration/registration.page').then(m => m.RegistrationPage),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'cards',
    loadComponent: () => import('./components/card/card.component').then(m => m.CardComponent),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'stats',
    loadComponent: () => import('./components/stats/stats.component').then(m => m.StatsComponent),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  { path: 'total-stats',
    loadComponent: () => import('./components/total-stats/total-stats.component').then( m => m.TotalStatsComponent),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'achievements',
    loadComponent: () => import('./components/achievements/achievements.component').then(m => m.AchievementsComponent),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./components/onboarding/onboarding.component').then( m => m.OnboardingComponent),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./components/auth/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage),
    //...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.page').then(m => m.ProfilePage),
    ...canActivate(redirectUnauthorizedToLogin)
  },

];
