/**
 * @fileoverview Diese Datei enthält die Implementierung der LoginPage-Komponente,
 * die es dem Benutzer ermöglicht, sich einzuloggen.
 */

import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import {
    IonButton,
    IonContent,
    IonFab, IonFabButton,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem, IonLabel, IonNote, IonText,
    IonTitle,
    IonToolbar
} from '@ionic/angular/standalone';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {AlertController, LoadingController} from "@ionic/angular";
import {UserService} from "../../../services/user.service";

/**
 * @component LoginPage
 * @description Diese Komponente ermöglicht es dem Benutzer, sich einzuloggen.
 */

@Component({
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
export class LoginPage {
    credentials: FormGroup;

    /**
     * @constructor
     * @param {FormBuilder} fb - Formular-Builder zum Erstellen von reaktiven Formularen.
     * @param {LoadingController} loadingController - Controller für Ladeanzeigen.
     * @param {AlertController} alertController - Controller für Alerts.
     * @param {Router} router - Router zum Navigieren zwischen Seiten.
     * @param {AuthService} authService - Service für Authentifizierungsoperationen.
     * @param {UserService} userService - Service für Benutzeroperationen.
     */

    constructor(
        private fb: FormBuilder,
        private loadingController: LoadingController,
        private alertController: AlertController,
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
    ) {
        this.credentials = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    /**
     * @property email
     * @description Einfacher Zugriff auf das E-Mail-Feld des Formulars.
     * @returns {FormControl} - Die E-Mail-Formularsteuerung.
     */

    //Easy access for form fields
    get email() {
        return this.credentials.get('email');
    }

    /**
     * @property password
     * @description Einfacher Zugriff auf das Passwort-Feld des Formulars.
     * @returns {FormControl} - Die Passwort-Formularsteuerung.
     */
    get password() {
        return this.credentials.get('password');
    }

    /**
     * @method login
     * @description Loggt den Benutzer ein, wenn die Anmeldedaten gültig sind.
     */
    async login() {
        if (this.credentials.valid) {
            const loading = await this.loadingController.create({
                message: 'Einloggen...',
            });
            await loading.present();
            const {email, password} = this.credentials.value;

            const userCredential = await this.authService.login(this.credentials.value);
            await loading.dismiss();

            if (userCredential) {
                const user = await this.userService.getUser(userCredential.user.uid);
                if (user) {
                    localStorage.setItem('userName', user.firstName);
                    await this.router.navigateByUrl('/home', {replaceUrl: true});
                }
            } else {
                await this.userService.showAlert('Login fehlgeschlagen', 'Versuche es' +
                    ' erneut!');
            }
        } else {
            await this.userService.showAlert('Login fehlgeschlagen', 'Bitte fülle alle' +
                ' erforderlichen' +
                ' Felder' +
                ' aus!');
        }
    }

    /**
     * @method onSignInWithGoogle
     * @description Loggt den Benutzer über Google ein.
     */
    async onSignInWithGoogle() {
        try {
            const result = await this.authService.loginWithGoogle();
            // Handle the result
        } catch (error) {
            // Handle the error
        }
    }
}
