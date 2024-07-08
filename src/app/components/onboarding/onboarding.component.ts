/**
 * @fileoverview Diese Datei enthält die Implementierung der Onboarding-Komponente,
 * die eine Einführung in die App mit interaktiven Lernmöglichkeiten, Wissensmodi und Achievements bietet.
 */


import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {
    IonButton, IonButtons, IonCol,
    IonContent, IonGrid,
    IonHeader,
    IonImg, IonRow,
    IonText, IonThumbnail,
    IonTitle
} from "@ionic/angular/standalone";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FooterPage} from "../footer/footer.page";

/**
 * @component OnboardingComponent
 * @description Diese Komponente zeigt die Onboarding-Sequenz der App an, bestehend aus
 * interaktiven Swiper-Slides, die den Benutzer durch die Hauptfeatures der App führen.
 */

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
    imports: [CommonModule, RouterModule, IonImg, IonContent, IonText, IonButton, IonHeader, IonTitle, IonGrid, IonRow, IonCol, IonThumbnail, IonButtons, FooterPage]

})
export class OnboardingComponent  implements OnInit {

    /**
     * @constructor
     * Erzeugt eine Instanz der OnboardingComponent.
     */
  constructor() { }

    /**
     * @method ngOnInit
     * @description Lebenszyklus-Hook, der nach der Initialisierung der Komponente aufgerufen wird.
     */
  ngOnInit() {}

}
