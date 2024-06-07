import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";


@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]

})
export class OnboardingComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
