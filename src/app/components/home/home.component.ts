import { Component } from '@angular/core';
import {IonicModule, LoadingController} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class HomeComponent {
  constructor(private authService: AuthService, private router: Router, private loadingController: LoadingController) {
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
}
