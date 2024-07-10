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
  IonToolbar,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
  email: string = '';

  /**
   * @constructor
   * Initialisiert die ForgotPasswordPage-Komponente.
   */
  constructor(
      private authService: AuthService,
      private alertController: AlertController,
      private loadingController: LoadingController,
      private router: Router
  ) {}

  async resetPassword() {
    if (this.email) {
      const loading = await this.showLoading('Bitte warten...');
      try {
        await this.authService.sendPasswordReset(this.email);
        await this.showAlert('Passwort zurücksetzen', 'Ein Link zum Zurücksetzen des Passworts' +
            ' wurde an Ihre E-Mail-Adresse gesendet.');
      } catch (error) {
        console.error("Fehler beim Senden des Passwort-Reset-Links:", error);
      } finally {
        await loading.dismiss();
      }
    } else {
      console.error("Bitte geben Sie eine E-Mail-Adresse ein.");
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigate(['/login']);
        }
      }]
    });

    await alert.present();
  }

  async showLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }
}
