import { Component } from '@angular/core';
import {IonicModule, LoadingController} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {Auth} from "@angular/fire/auth";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class HomeComponent {
  userName: string = 'User';

  constructor(
      private authService: AuthService,
      private router: Router,
      private loadingController: LoadingController,
      private auth: Auth
  ) {
  }
  async logout() {
    const loading = await this.loadingController.create({
      message: 'Logging out...',
    });
    await loading.present();
    await this.authService.logout();
    loading.dismiss();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
  ngOnInit() {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      this.authService.getUserDetails(currentUser.uid).then((userDetails) => {
        if (userDetails) {
          this.userName = `${userDetails.firstName}`;
        }
      });
    }
  }
}
