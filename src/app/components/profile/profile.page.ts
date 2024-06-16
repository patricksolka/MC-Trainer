import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
    IonButton,
    IonContent,
    IonHeader, IonIcon,
    IonInput,
    IonNote, IonText,
    IonTitle,
    IonToolbar
} from '@ionic/angular/standalone';
import {LoadingController} from "@ionic/angular";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {User} from "../../models/user.model";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
    standalone: true,
    imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonNote, IonText, ReactiveFormsModule, IonButton, IonIcon]
})
export class ProfilePage {
    credentials: FormGroup;


    private user: User = new User();



    constructor(private loadingController: LoadingController,
                private authService: AuthService,
                private router: Router,
                private userService: UserService,
                private fb: FormBuilder) {

        this.credentials = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
        this.fetchUser();
    }

    /*inputDidChange(){
            return this.credentials.pristine ||
                (this.credentials.value.firstName === this.user.firstName &&
                    this.credentials.value.lastName === this.user.lastName &&
                    this.credentials.value.email === this.user.email );
                    //this.credentials.value.password === this.user.password
    }*/


    fetchUser() {
        const uid = this.authService.auth.currentUser.uid;
        this.userService.getUser(uid).then(user => {
            if (user) {
                console.log('Found user:', user);
                Object.assign(this.user, user);
                this.credentials.patchValue({
                    firstName: this.user.firstName,
                    lastName: this.user.lastName,
                    email: this.user.email
                });
            } else {
                console.log('No user found with id:', uid);
            }
        });
    }


    async logout() {
        const loading = await this.loadingController.create({
            message: 'Logging out...',
        });
        await loading.present();
        this.authService.logout();
        await loading.dismiss();
        await this.router.navigateByUrl('/login', {replaceUrl: true});
    }

    async deleteProfile() {
        const loading = await this.loadingController.create({
            message: 'Deleting profile...',
        });
        await loading.present();
        const uid = this.authService.auth.currentUser.uid;
        await this.userService.deleteUser(uid);
        await loading.dismiss();
        await this.router.navigateByUrl('/login', {replaceUrl: true});
    }

    async updateProfile() {
        if (this.credentials.valid) {
            const loading = await this.loadingController.create({
                message: 'Änderungen werden gespeichert',
            });
            await loading.present();
           Object.assign(this.user, this.credentials.value);
           await this.userService.updateUser(this.user);
            await loading.dismiss();
            console.log('Profile updated', this.user);
        } else {
            console.log('Form is not valid');
        }
    }

    ionViewWillEnter() {
        this.fetchUser();
    }
}


//const uid = this.authService.auth.currentUser.uid;
//this.userService.getUser(uid);