import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { IonApp, IonContent, IonFooter, IonHeader, IonRouterOutlet, } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { personOutline, personCircle, chevronForward, lockClosedOutline, mailOutline, home, book, addCircle, statsChart, person, arrowBackOutline, logoGoogle, statsChartOutline, addOutline, searchOutline, trash, search, checkmarkCircle, sadOutline } from "ionicons/icons";
import { HttpClientModule } from "@angular/common/http";
import { FooterPage } from "./components/footer/footer.page";
import { NgIf } from "@angular/common";
let AppComponent = class AppComponent {
    constructor(router, cardService) {
        this.router = router;
        this.cardService = cardService;
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
        });
        //TODO: Beim Quiz evtl verhalten vom footer anpassen
        const excludedRoutes = ['/login', '/register', '/cards/', '/onboarding'];
        this.router.events.subscribe(() => {
            this.showFooter = !excludedRoutes.some(route => this.router.url.includes(route));
        });
    }
};
AppComponent = __decorate([
    Component({
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
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map