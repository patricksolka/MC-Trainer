import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonFooter,
  IonHeader, IonIcon, IonLabel,
  IonTabBar,
  IonTabButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.page.html',
  styleUrls: ['./footer.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFooter, IonTabBar, IonTabButton, IonIcon, IonLabel, RouterLink, RouterLinkActive]
})
export class FooterPage implements OnInit {
  constructor() {

  }

  ngOnInit() {
  }

}
