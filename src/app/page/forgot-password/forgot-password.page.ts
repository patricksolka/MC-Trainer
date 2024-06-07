import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton, IonButton,
  IonButtons, IonCol,
  IonContent,
  IonHeader, IonInput,
  IonItem, IonLabel, IonList, IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonItem, IonLabel, IonInput, IonRow, IonCol, IonButton, IonList, RouterLink]
})
export class ForgotPasswordPage {
  username: string = '';
  newPassword: string = '';

  constructor(private authService: AuthService) { }
  resetPassword() {
    if (this.authService.resetPassword(this.username, this.newPassword)) {
      alert('Password reset successfully');
    } else {
      alert('Username not found');
    }
  }
}
