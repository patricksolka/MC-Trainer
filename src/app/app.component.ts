import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from "@ionic/angular/standalone";
import { HttpClientModule } from '@angular/common/http';
import { CardService } from './services/card.service';
import { Question } from './models/question.model';
import {addIcons} from 'ionicons';
/*import {
  add, arrowDown, bonfireOutline, heartSharp,
  leafOutline,
  returnDownBackOutline, shieldHalf,
  shirt,
  statsChartOutline,
  sync,
  tabletLandscapeOutline, volumeMediumSharp
} from "ionicons/icons";

 */

import {personOutline, chevronForward,lockClosedOutline,mailOutline,
  home, book, addCircle, statsChart, person} from "ionicons/icons";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    HttpClientModule,
    IonRouterOutlet,
    IonApp
  ],
  providers: [ HttpClientModule],
  standalone: true // Markiere die Komponente als eigenständig
})
export class AppComponent implements OnInit {
  questions: Question[] = []; // Initialisiere die Variable mit einem leeren Array

  constructor(private cardService: CardService) {
    addIcons({personOutline, chevronForward, lockClosedOutline, mailOutline,
      home, book, addCircle, statsChart, person});
  }

  ngOnInit() {
    this.cardService.getQuestions().subscribe(data => {
      this.questions = data;
    });
  }
}
