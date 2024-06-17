import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterLink } from "@angular/router";
let LoginPage = class LoginPage {
    constructor() { }
};
LoginPage = __decorate([
    Component({
        selector: 'app-login',
        templateUrl: './login.page.html',
        styleUrls: ['./login.page.scss'],
        standalone: true,
        imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonIcon, IonItem, RouterLink, IonFab, IonFabButton]
    })
], LoginPage);
export { LoginPage };
//# sourceMappingURL=login.page.js.map