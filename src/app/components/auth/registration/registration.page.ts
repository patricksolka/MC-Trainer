/**
 * @fileoverview Diese Datei enthält die Implementierung der RegistrationPage-Komponente,
 * die es dem Benutzer ermöglicht, sich zu registrieren.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput, IonItem, IonNote, IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {Router, RouterLink} from "@angular/router";
import {AlertController, LoadingController} from "@ionic/angular";
import {AuthService} from "../../../services/auth.service";
import {UserService} from "../../../services/user.service";

/**
 * @component RegistrationPage
 * @description Diese Komponente ermöglicht es dem Benutzer, sich zu registrieren.
 */

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFab, IonFabButton, IonIcon, IonInput, IonItem, RouterLink, IonButton, IonNote, ReactiveFormsModule, IonText]
})
export class RegistrationPage  {

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
      private userService: UserService
  ) {
    this.credentials = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * @property email
   * @description Einfacher Zugriff auf das E-Mail-Feld des Formulars.
   * @returns {FormControl} - Die E-Mail-Formularsteuerung.
   */
  get email(){
    return this.credentials.get('email');
  }

  /**
   * @property password
   * @description Einfacher Zugriff auf das Passwort-Feld des Formulars.
   * @returns {FormControl} - Die Passwort-Formularsteuerung.
   */
  get password(){
    return this.credentials.get('password');
  }

  /**
   * @method register
   * @description Registriert den Benutzer, wenn die Anmeldedaten gültig sind.
   */
  async register() {
    if (this.credentials.valid) {
      const loading = await this.loadingController.create({
        message: 'Registrieren...',
      });
      await loading.present();
      const {firstName, lastName, email, password } = this.credentials.value;
      const user = await this.authService.register(this.credentials.value);
      await loading.dismiss();

      if (user) {
        localStorage.setItem('userName', user.firstName);
        await this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        await this.userService.showAlert('Registrierung fehlgeschlagen', 'Versuche es erneut!');
      }
    } else {
      await this.userService.showAlert('Registrierung fehlgeschlagen', 'Bitte fülle alle' +
          ' erforderlichen Felder aus!');
    }
  }
}
