import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterLink } from "@angular/router";
let ForgotPasswordPage = class ForgotPasswordPage {
    constructor() { }
};
ForgotPasswordPage = __decorate([
    Component({
        selector: 'app-forgot-password',
        templateUrl: './forgot-password.page.html',
        styleUrls: ['./forgot-password.page.scss'],
        standalone: true,
        imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonInput, IonIcon, IonFab, IonFabButton, RouterLink]
    })
], ForgotPasswordPage);
export { ForgotPasswordPage };
//# sourceMappingURL=forgot-password.page.js.map