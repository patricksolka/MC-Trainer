import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { personOutline, chevronForward, lockClosedOutline, mailOutline, home, book, addCircle, statsChart, person, arrowBackOutline, statsChartOutline, addOutline, searchOutline } from "ionicons/icons";
let AppComponent = class AppComponent {
    constructor(router) {
        this.router = router;
        addIcons({ personOutline, chevronForward, lockClosedOutline, mailOutline, home, book, addCircle, statsChart, person, arrowBackOutline, statsChartOutline, addOutline, searchOutline });
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: 'app.component.html',
        imports: [
            IonRouterOutlet,
            IonApp
        ],
        standalone: true
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map