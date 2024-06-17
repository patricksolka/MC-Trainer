import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterLink } from "@angular/router";
let RegistrationPage = class RegistrationPage {
    constructor() { }
};
RegistrationPage = __decorate([
    Component({
        selector: 'app-registration',
        templateUrl: './registration.page.html',
        styleUrls: ['./registration.page.scss'],
        standalone: true,
        imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFab, IonFabButton, IonIcon, IonInput, IonItem, RouterLink]
    })
], RegistrationPage);
export { RegistrationPage };
//# sourceMappingURL=registration.page.js.map