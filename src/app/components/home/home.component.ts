import {Component} from '@angular/core';
import {IonicModule, LoadingController} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {UserService} from 'src/app/services/user.service';
import {AuthService} from 'src/app/services/auth.service';
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [IonicModule, CommonModule, RouterModule, FormsModule]
})
export class HomeComponent {
    public userName: string = localStorage.getItem('userName') || 'User';

    constructor(private router: Router,
                private loadingController: LoadingController,
                private userService: UserService,
                private authService: AuthService) {
        //this.getUserName();
    }

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
}
