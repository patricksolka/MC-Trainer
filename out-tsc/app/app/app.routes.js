export const routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'cards',
        loadComponent: () => import('./components/card/card.component').then(m => m.CardComponent)
    },
    {
        path: 'stats',
        loadComponent: () => import('./components/stats/stats.component').then(m => m.StatsComponent)
    },
    {
        path: 'achievements',
        loadComponent: () => import('./components/achievements/achievements.component').then(m => m.AchievementsComponent)
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./components/auth/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage)
    },
    {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login.page').then(m => m.LoginPage)
    },
    {
        path: 'register',
        loadComponent: () => import('./components/auth/registration/registration.page').then(m => m.RegistrationPage)
    },
    {
        path: 'categories',
        loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent)
    },
];
//# sourceMappingURL=app.routes.js.map