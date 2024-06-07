import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton, IonButton,
  IonButtons, IonCol,
  IonContent,
  IonHeader, IonInput,
  IonItem, IonLabel, IonList, IonRouterLink, IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonItem, IonLabel, IonInput, IonRow, IonCol, IonButton, IonList, IonRouterLink, RouterLink]
})
export class RegistrationPage {
  username: string = '';
  password: string = '';
  email: string = '';
  firstname: string = '';
  lastname: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    const user = new User(this.username, this.password, this.email, this.firstname, this.lastname);
    if (this.authService.register(user)) {
      this.router.navigateByUrl('/login');
    } else {
      alert('Username already exists');
    }
  }
}
