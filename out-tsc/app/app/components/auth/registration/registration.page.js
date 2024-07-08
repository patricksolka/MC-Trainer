import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonNote, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterLink } from "@angular/router";
let RegistrationPage = class RegistrationPage {
    constructor(fb, loadingController, alertController, router, authService, userService) {
        this.fb = fb;
        this.loadingController = loadingController;
        this.alertController = alertController;
        this.router = router;
        this.authService = authService;
        this.userService = userService;
        this.credentials = this.fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
    //Easy access for form fields
    get email() {
        return this.credentials.get('email');
    }
    get password() {
        return this.credentials.get('password');
    }
    async register() {
        if (this.credentials.valid) {
            const loading = await this.loadingController.create({
                message: 'Registrieren...',
            });
            await loading.present();
            const { firstName, lastName, email, password } = this.credentials.value;
            const user = await this.authService.register(this.credentials.value);
            await loading.dismiss();
            if (user) {
                localStorage.setItem('userName', user.firstName);
                await this.router.navigateByUrl('/home', { replaceUrl: true });
            }
            else {
                await this.userService.showAlert('Registrierung fehlgeschlagen', 'Versuche es erneut!');
            }
        }
        else {
            await this.userService.showAlert('Registrierung fehlgeschlagen', 'Bitte fülle alle' +
                ' erforderlichen Felder aus!');
        }
    }
};
RegistrationPage = __decorate([
    Component({
        selector: 'app-registration',
        templateUrl: './registration.page.html',
        styleUrls: ['./registration.page.scss'],
        standalone: true,
        imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFab, IonFabButton, IonIcon, IonInput, IonItem, RouterLink, IonButton, IonNote, ReactiveFormsModule, IonText]
    })
], RegistrationPage);
export { RegistrationPage };
//# sourceMappingURL=registration.page.js.map