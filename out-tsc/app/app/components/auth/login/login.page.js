import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonNote, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterLink } from "@angular/router";
let LoginPage = class LoginPage {
    constructor(fb, loadingController, alertController, router, authService, userService) {
        this.fb = fb;
        this.loadingController = loadingController;
        this.alertController = alertController;
        this.router = router;
        this.authService = authService;
        this.userService = userService;
        this.credentials = this.fb.group({
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
    async login() {
        if (this.credentials.valid) {
            const loading = await this.loadingController.create({
                message: 'Einloggen...',
            });
            await loading.present();
            const { email, password } = this.credentials.value;
            const userCredential = await this.authService.login(this.credentials.value);
            await loading.dismiss();
            if (userCredential) {
                const user = await this.userService.getUser(userCredential.user.uid);
                if (user) {
                    localStorage.setItem('userName', user.firstName);
                    await this.router.navigateByUrl('/home', { replaceUrl: true });
                }
            }
            else {
                await this.userService.showAlert('Login fehlgeschlagen', 'Versuche es' +
                    ' erneut!');
            }
        }
        else {
            await this.userService.showAlert('Login fehlgeschlagen', 'Bitte fülle alle' +
                ' erforderlichen' +
                ' Felder' +
                ' aus!');
        }
    }
    async onSignInWithGoogle() {
        try {
            const result = await this.authService.loginWithGoogle();
            // Handle the result
        }
        catch (error) {
            // Handle the error
        }
    }
};
LoginPage = __decorate([
    Component({
        selector: 'app-login',
        templateUrl: './login.page.html',
        styleUrls: ['./login.page.scss'],
        standalone: true,
        imports: [IonContent,
            IonHeader,
            IonTitle,
            IonToolbar,
            IonInput,
            IonIcon,
            IonItem,
            IonFab,
            IonFabButton,
            IonButton,
            IonNote,
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            RouterLink, IonText, IonLabel,]
    })
], LoginPage);
export { LoginPage };
//# sourceMappingURL=login.page.js.map