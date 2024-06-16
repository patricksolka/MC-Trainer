import { Component } from '@angular/core';
import {IonicModule, LoadingController} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
    imports: [IonicModule, CommonModule, RouterModule, FormsModule]
})
export class HomeComponent {
  user: any;
  constructor(private router: Router, private loadingController: LoadingController, private userService: UserService, private authService: AuthService) {
    const uid = this.authService.auth.currentUser.uid;
    this.userService.getUser(uid);
  }
  /*async logout() {
    const loading = await this.loadingController.create({
      message: 'Logging out...',
    });
    await loading.present();
    await this.authService.logout();
    loading.dismiss();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }*/
}
