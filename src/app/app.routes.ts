import { Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from "@angular/fire/auth-guard";

const redirectUnauthorizedToOnboarding = () => {
  return redirectUnauthorizedTo(['onboarding']);
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
    ...canActivate(redirectUnauthorizedToOnboarding)
  },
  {
    path: 'categories',
    loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent),
    ...canActivate(redirectUnauthorizedToOnboarding)
  },
  {
    path: 'cards/:categoryId',
    loadComponent: () => import('./components/card/card.component').then(m => m.CardComponent),
    ...canActivate(redirectUnauthorizedToOnboarding)
  },
  {
    path: 'stats',
    loadComponent: () => import('./components/stats/stats.component').then(m => m.StatsComponent),
    ...canActivate(redirectUnauthorizedToOnboarding)
  },
  { path: 'total-stats',
    loadComponent: () => import('./components/total-stats/total-stats.component').then( m => m.TotalStatsComponent),
    ...canActivate(redirectUnauthorizedToOnboarding)
  },
  {
    path: 'achievements',
    loadComponent: () => import('./components/achievements/achievements.component').then(m => m.AchievementsComponent),
    ...canActivate(redirectUnauthorizedToOnboarding)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./components/onboarding/onboarding.component').then( m => m.OnboardingComponent),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./components/auth/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage),
    //...canActivate(redirectUnauthorizedToOnboarding)
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.page').then(m => m.ProfilePage),
    ...canActivate(redirectUnauthorizedToOnboarding)
  },
  {
    path: 'footer',
    loadComponent: () => import('./components/footer/footer.page').then( m => m.FooterPage)

  },
  {
    path: 'personalFavorites',
    loadComponent: () => import('./components/personalFavorites/personalFavorites').then(m => m.PersonalFavorites),
    ...canActivate(redirectUnauthorizedToOnboarding)
  },
  {
    path: 'progressbar',
    loadComponent: () => import('./components/progress-bar/progress-bar.component').then( m => m.ProgressBarComponent)
  },


];
