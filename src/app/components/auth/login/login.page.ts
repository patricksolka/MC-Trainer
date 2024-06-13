import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Form, FormsModule} from '@angular/forms';
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
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonIcon, IonItem, RouterLink, IonFab, IonFabButton]
})
export class LoginPage  {


  constructor(
      private authService: AuthService,
      private router : Router
  ) { }

}
