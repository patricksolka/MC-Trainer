import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, NavController} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
    personOutline,
    chevronForward,
    lockClosedOutline,
    mailOutline,
    home,
    book,
    addCircle,
    statsChart,
    person,
    arrowBackOutline,
    logoGoogle,
    statsChartOutline,
    addOutline,
    searchOutline,
    trash, search
} from "ionicons/icons";
import { Router } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { CardService } from './services/card.service';
import { Question } from './models/_question.model';
import {FooterPage} from "./components/footer/footer.page";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [
        HttpClientModule,
        IonRouterOutlet,
        IonApp,
        FooterPage
    ],
    standalone: true
})
export class AppComponent {
    questions: Question[] = [];

    constructor(private router: Router, private cardService: CardService) {
        addIcons({
            personOutline,
            chevronForward,
            lockClosedOutline,
            mailOutline,
            home,
            book,
            addCircle,
            statsChart,
            person,
            arrowBackOutline,
            logoGoogle,
            statsChartOutline,
            addOutline,
            searchOutline,
            trash,
            search
        });

        // Lade die Fragen beim Initialisieren der Komponente
        /*
        this.cardService.getQuestions().subscribe(data => {
            this.questions = data;
        });
         */
    }
}