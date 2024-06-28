import {Component} from '@angular/core';
import {
    IonApp, IonContent,
    IonFooter,
    IonHeader,
    IonRouterOutlet,
    NavController
} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {
    personOutline,
    personCircle,
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
import {Router} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {CardService} from './services/card.service';
import {Question} from './models/_question.model';
import {FooterPage} from "./components/footer/footer.page";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [
        HttpClientModule,
        IonRouterOutlet,
        IonApp,
        FooterPage,
        IonFooter,
        IonHeader,
        IonContent,
        NgIf
    ],
    standalone: true
})

export class AppComponent {

    public showFooter: boolean;

    //questions: Question[] = [];

    constructor(private router: Router, private cardService: CardService) {
        addIcons({
            personOutline,
            personCircle,
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

        //TODO: Beim Quiz evtl verhalten vom footer anpassen
        this.router.events.subscribe(() => {
            this.showFooter = !this.router.url.includes('/login') &&
                !this.router.url.includes('/register') &&
                !this.router.url.includes('/cards/') &&
                !this.router.url.includes('/onboarding');
        });
    }
}