import { Component, OnInit } from '@angular/core';
import {
  IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol,
  IonContent, IonFab, IonFabButton,
  IonFooter, IonGrid,
  IonHeader, IonIcon, IonItem, IonList,
  IonNav, IonRippleEffect, IonRow,
  IonSegment, IonTabBar, IonTabButton, IonTabs,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  standalone: true,
  styleUrls: ['./categories.component.scss'],
  imports: [
    IonHeader,
    IonContent,
    IonFooter,
    IonSegment,
    IonNav,
    IonToolbar,
    IonTitle,
    IonFab,
    IonFabButton,
    IonIcon,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonButton,
    IonRippleEffect,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonGrid,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent
  ]
})
export class CategoriesComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
