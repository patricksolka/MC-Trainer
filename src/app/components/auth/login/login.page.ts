import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class LoginPage  {
  credentials: FormGroup;


  constructor(
      private fb: FormBuilder,
      private loadingController: LoadingController,
      private alertController: AlertController,
      private router: Router,
      private authService: AuthService
  ) {
    this.credentials = this.fb.group({
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

  async login(){
    const loading = await this.loadingController.create();
    await loading.present();
    const { email, password } = this.credentials.value;

    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if (user) {
      await this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      await this.showAlert('Login fehlgeschlagen' , 'Versuche es erneut!');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.credentials.reset();
          },
        },
      ],
    });

    await alert.present();
  }
}
