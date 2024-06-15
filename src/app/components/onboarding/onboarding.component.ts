import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {
  IonButton, IonCol,
  IonContent, IonGrid,
  IonHeader,
  IonImg, IonRow,
  IonText,
  IonTitle
} from "@ionic/angular/standalone";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";


@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [CommonModule, RouterModule, IonImg, IonContent, IonText, IonButton, IonHeader, IonTitle, IonGrid, IonRow, IonCol]

})
export class OnboardingComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
