/**
 * @fileoverview Diese Datei enthält die Implementierung der FooterPage-Komponente,
 * die den Footer-Bereich der Anwendung darstellt.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonFooter,
  IonHeader, IonIcon, IonLabel,
  IonTabBar,
  IonTabButton, IonTabs,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {RouterLink, RouterLinkActive} from "@angular/router";

/**
 * @component FooterPage
 * @description Diese Komponente stellt den Footer-Bereich der Anwendung dar, einschließlich der Tab-Navigation.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.page.html',
  styleUrls: ['./footer.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFooter, IonTabBar, IonTabButton, IonIcon, IonLabel, RouterLink, RouterLinkActive, IonTabs]
})
export class FooterPage implements OnInit {
  /**
   * @constructor
   * Initialisiert die FooterPage-Komponente.
   */
  constructor() {

  }
  /**
   * @method ngOnInit
   * @description Lebenszyklus-Hook, der nach der Initialisierung der Komponente aufgerufen wird.
   */
  ngOnInit() {
  }

}
