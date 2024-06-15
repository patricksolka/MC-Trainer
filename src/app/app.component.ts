import {Component} from '@angular/core';
import {IonApp, IonRouterOutlet} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
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
    logoGoogle
} from "ionicons/icons";
import {Router} from "@angular/router";
import {HttpClientModule} from '@angular/common/http';
import {CardService} from './services/card.service';
import {Question} from './models/question.model';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [
        HttpClientModule,
        IonRouterOutlet,
        IonApp
    ],
    standalone: true,
    providers: [HttpClientModule],

})
export class AppComponent {
    questions: Question[] = []; // Initialisiere die Variable mit einem leeren Array

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
            logoGoogle
        });
        this.cardService.getQuestions().subscribe(data => {
            this.questions = data;
        });
    }
}
