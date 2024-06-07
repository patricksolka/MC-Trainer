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
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButtons, IonItem, IonLabel, IonInput, IonRow, IonCol, IonButton, IonList, HttpClientModule, RouterLink]
})
export class LoginPage{
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  async login() {
    if (this.authService.login(this.username, this.password)) {
      await this.router.navigateByUrl('/home');
    } else {
      alert('Invalid credentials');
    }
  }
}
