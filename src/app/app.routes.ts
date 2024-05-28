import { Routes } from '@angular/router';
import { CardComponent } from './card/card.component';
import { StatsComponent } from './stats.component';

export const routes: Routes = [
  { path: '', redirectTo: '/cards', pathMatch: 'full' }, // Standardroute auf die Lernkarten
  { path: 'cards', component: CardComponent }, // Route für die Lernkarten
  { path: 'stats', component: StatsComponent }, // Route für die Statistik
  { path: '**', redirectTo: '/cards' } // Weiterleitung für unbekannte Routen auf die Lernkarten
];
