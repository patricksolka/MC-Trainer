// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CardComponent } from './components/card/card.component';
import { StatsComponent } from './components/stats/stats.component';
import {AchievementsComponent} from "./components/achievements/achievements.component";

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'cards', component: CardComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'achievements', component: AchievementsComponent },
  { path: '**', redirectTo: 'home' },
];
