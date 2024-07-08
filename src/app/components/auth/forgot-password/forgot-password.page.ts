/**
 * @fileoverview Diese Datei enthält die Implementierung der ForgotPasswordPage-Komponente,
 * die es dem Benutzer ermöglicht, das Passwort zurückzusetzen.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonFab, IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {RouterLink} from "@angular/router";

/**
 * @component ForgotPasswordPage
 * @description Diese Komponente ermöglicht es dem Benutzer, das Passwort zurückzusetzen.
 */
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonInput, IonIcon, IonFab, IonFabButton, RouterLink]
})
export class ForgotPasswordPage {

  /**
   * @constructor
   * Initialisiert die ForgotPasswordPage-Komponente.
   */
  constructor() { }


}
