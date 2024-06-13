import { Component } from '@angular/core';
import {IonApp, IonRouterOutlet, NavController} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {personOutline, chevronForward,lockClosedOutline,mailOutline} from "ionicons/icons";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonRouterOutlet,
    IonApp
  ],
  standalone: true // Markiere die Komponente als eigenständig
})
export class AppComponent {
  constructor(private router: Router) {
  addIcons({personOutline, chevronForward, lockClosedOutline, mailOutline});
  }
}

