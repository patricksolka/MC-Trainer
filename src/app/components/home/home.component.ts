import {Component} from '@angular/core';
import {IonicModule, LoadingController} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {UserService} from 'src/app/services/user.service';
import {AuthService} from 'src/app/services/auth.service';
import {FormsModule} from "@angular/forms";
import {FooterPage} from "../footer/footer.page";
import {Auth} from "@angular/fire/auth";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [IonicModule, CommonModule, RouterModule, FormsModule, FooterPage]
})
export class HomeComponent {
    public userName: string = localStorage.getItem('userName') || 'User';

    /*async getUserName() {
        const currentUser = this.authService.auth.currentUser;
        if (currentUser) {
            await this.userService.getUser(currentUser.uid).then((userDetails) => {
                this.userName = localStorage.getItem('userName') || 'User';
                if (userDetails) {
                    this.userName = `${userDetails.firstName}`;
                }
            });
        }
    }*/

    ionViewWillEnter() {
        this.userName = localStorage.getItem('userName') || 'User';
        console.log('IonViewWillEnter');
    }

  // userName: string = 'User';

  constructor(
      private authService: AuthService,
      private router: Router,
      private loadingController: LoadingController,
      private auth: Auth
  ) {
    this.getUser();
    console.log(this.userName);
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
    async getUser() {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        await this.authService.getUserDetails(currentUser.uid).then((userDetails) => {
          if (userDetails) {
            this.userName = `${userDetails.firstName}`;
          }
        });
      }
    }
}
