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


@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
    imports: [CommonModule, RouterModule, IonImg, IonContent, IonText, IonButton, IonHeader, IonTitle, IonGrid, IonRow, IonCol, IonThumbnail, IonButtons, FooterPage]

})
export class OnboardingComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
