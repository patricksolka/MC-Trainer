// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { CardComponent } from './card/card.component';
import { StatsComponent } from './stats.component';
import {AchievementsComponent} from "./achievements/achievements.component";

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'cards', component: CardComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'achievements', component: AchievementsComponent },
  { path: '**', redirectTo: 'home' },
];
