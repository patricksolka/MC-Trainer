/**
 * @fileoverview Diese Datei enthält die AppComponent, die die Hauptkomponente der Anwendung darstellt.
 */
import {Component} from '@angular/core';
import {
    IonApp, IonContent,
    IonFooter,
    IonHeader,
    IonRouterOutlet,
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
    trash,
    search,
    checkmarkCircle,
    sadOutline,
    trophyOutline,
    flashOutline,
    medalOutline,
    starOutline,
    diamondOutline,
    podiumOutline,
    ribbonOutline,
    trophy,
    checkmarkCircleOutline, ribbon, happy, heart, flower


} from "ionicons/icons";
import {Router} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {CardService} from './services/card.service';
import {FooterPage} from "./components/footer/footer.page";
import {NgIf} from "@angular/common";

/**
 * @class AppComponent
 * @description Die Hauptkomponente der Anwendung.
 */
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

    /**
     * @constructor
     * @param {Router} router - Router zum Navigieren zwischen Seiten.
     * @param {CardService} cardService - Service für Kartenoperationen.
     */
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
            search,
            checkmarkCircle,
            sadOutline,
            trophyOutline,
            flashOutline,
            medalOutline,
            starOutline,
            diamondOutline,
            podiumOutline,
            ribbonOutline,
            trophy,
            checkmarkCircleOutline,
            ribbon,
            happy,
            flower
        });

        //TODO: Beim Quiz evtl verhalten vom footer anpassen
        const excludedRoutes = ['/login', '/register', '/cards/', '/onboarding'];

        this.router.events.subscribe(() => {
            this.showFooter = !excludedRoutes.some(route => this.router.url.includes(route));
        });
    }
}