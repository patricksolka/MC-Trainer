import { Component} from '@angular/core';
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

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFab, IonFabButton, IonIcon, IonInput, IonItem, RouterLink, IonButton, IonNote, ReactiveFormsModule, IonText]
})
export class RegistrationPage  {

  credentials: FormGroup;


  constructor(
      private fb: FormBuilder,
      private loadingController: LoadingController,
      private alertController: AlertController,
      private router: Router,
      private authService: AuthService
  ) {
    this.credentials = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  //Easy access for form fields
  get email(){
    return this.credentials.get('email');
  }

  get password(){
    return this.credentials.get('password');
  }
  async register() {
    if (this.credentials.valid) {
      const loading = await this.loadingController.create();
      await loading.present();
      const {firstName, lastName, email, password } = this.credentials.value;
      const user = await this.authService.register(this.credentials.value);
      await loading.dismiss();

      if (user) {
        localStorage.setItem('userName', user.firstName);
        await this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        await this.showAlertRegister('Registrierung fehlgeschlagen', 'Versuche es erneut!');
      }
    } else {
      await this.showAlertRegister('Registrierung fehlgeschlagen', 'Bitte fülle alle' +
          ' erforderlichen Felder aus!');
    }
  }

  async showAlertRegister(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            //this.credentials.reset();
          },
        },
      ],
    });
    await alert.present();
  }

}
