/**
 * @fileoverview Diese Datei enthält die Implementierung der ProfilePage-Komponente,
 * die das Benutzerprofil anzeigt und ermöglicht, das Profil zu aktualisieren oder zu löschen.
 */

import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
    IonButton, IonButtons,
    IonContent,
    IonHeader, IonIcon,
    IonInput,
    IonNote, IonSegment, IonText,
    IonTitle,
    IonToolbar
} from '@ionic/angular/standalone';
import {LoadingController} from "@ionic/angular";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {Router, RouterLink, RouterModule} from "@angular/router";
import {User} from "../../models/user.model";
import {FooterPage} from "../footer/footer.page";
import {onAuthStateChanged} from "@angular/fire/auth";

/**
 * @component ProfilePage
 * @description Diese Komponente zeigt das Benutzerprofil an und ermöglicht es,
 * das Profil zu aktualisieren oder zu löschen.
 */
@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
    standalone: true,
    imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonNote, IonText, ReactiveFormsModule, IonButton, IonIcon, RouterLink, FooterPage, IonButtons, IonSegment]
})
export class ProfilePage {
    credentials: FormGroup;


    private user: User = new User();


    /**
     * @constructor
     * @param {LoadingController} loadingController - Controller für Ladeanzeigen.
     * @param {AuthService} authService - Service für Authentifizierungsoperationen.
     * @param {Router} router - Router zum Navigieren zwischen Seiten.
     * @param {UserService} userService - Service für Benutzeroperationen.
     * @param {FormBuilder} fb - Formular-Builder zum Erstellen von reaktiven Formularen.
     */
    constructor(private loadingController: LoadingController,
                private authService: AuthService,
                private router: Router,
                private userService: UserService,
                private fb: FormBuilder) {

        this.credentials = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            //password: ['', Validators.required]
        });
        this.fetchUser();
    }

    /**
     * @method fetchUser
     * @description Holt die Benutzerdaten aus der Datenbank und aktualisiert das Formular.
     */
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

    /**
     * @method logout
     * @description Loggt den Benutzer aus und navigiert zur Onboarding-Seite.
     */
    async logout() {
        const loading = await this.loadingController.create({
            message: 'Ausloggen...',
        });
        await loading.present();
        this.authService.logout();
        await loading.dismiss();
        await this.router.navigateByUrl('/onboarding', {replaceUrl: true});
    }

    /**
     * @method deleteProfile
     * @description Löscht das Benutzerprofil aus der Datenbank.
     */
    //TODO: Add ConfirmAlert before deleting profile
    async deleteProfile() {
        const loading = await this.loadingController.create({
            message: 'Profil wird gelöscht...',
        });
        await loading.present();
        const uid = this.authService.auth.currentUser.uid;
        await this.userService.deleteUser(uid);
        this.authService.deleteProfile();
        await loading.dismiss();

    }

    /**
     * @method updateProfile
     * @description Aktualisiert das Benutzerprofil in der Datenbank.
     */

    //TODO: Fix updateProfile
    //TODO: when updating profile, password is stored in db without hashing
    //TODO: Synchronize Auth with Firestore

    async updateProfile() {
        if (this.credentials.valid) {
            const loading = await this.loadingController.create({
                message: 'Änderungen werden gespeichert',
            });
            await loading.present();
            Object.assign(this.user, this.credentials.value);
            await this.userService.updateUser(this.user);
            localStorage.setItem('userName', this.user.firstName);
            await loading.dismiss();
            console.log('Profile updated', this.user);
        } else {
            console.log('Form is not valid');
        }
    }

    /**
     * @method ionViewWillEnter
     * @description Lebenszyklus-Hook, der aufgerufen wird, wenn die Ansicht in den Vordergrund tritt.
     */
    ionViewWillEnter() {
        this.fetchUser();
        console.log('AuthService.auth:', this.authService.auth);
        console.log('AuthService.auth.currentUser:', this.authService.auth.currentUser);

        onAuthStateChanged(this.authService.auth, (user) => {
            if (user) {
                console.log('User is logged in:', user);
            } else {
                console.log('User is logged out');
            }
        });
    }

    /**
     * @method ionViewDidLeave
     * @description Lebenszyklus-Hook, der aufgerufen wird, wenn die Ansicht verlassen wird.
     */
    ionViewDidLeave(){
        onAuthStateChanged(this.authService.auth, (user) => {
            if (user) {
                console.log('User is logged in:', user);
            } else {
                console.log('User is logged out');
            }
        });
    }
}