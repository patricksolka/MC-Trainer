/**
 * @fileoverview Diese Datei enthält den AuthService, der die Authentifizierungs- und Benutzerverwaltung übernimmt.
 */

import {Injectable} from '@angular/core';
import {User} from '../models/user.model';
import {
    Auth,
    createUserWithEmailAndPassword,
    deleteUser,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from '@angular/fire/auth';
import {doc, Firestore, getDoc, onSnapshot, setDoc} from "@angular/fire/firestore";
import {UserService} from "./user.service";
import {Router} from "@angular/router";

/**
 * @class AuthService
 * @description Dieser Service übernimmt die Authentifizierungs- und Benutzerverwaltungsfunktionen.
 */
@Injectable({
    providedIn: 'root'
})

export class AuthService {

    /**
     * @constructor
     * @param {Auth} auth - Firebase Auth-Instanz.
     * @param {Firestore} firestore - Firebase Firestore-Instanz.
     * @param {UserService} userService - Service für Benutzeroperationen.
     * @param {Router} router - Router zum Navigieren zwischen Seiten.
     */
    constructor(public auth: Auth,
                private firestore: Firestore,
                private userService: UserService,
                private router: Router) {
    }

    /**
     * @method register
     * @description Registriert einen neuen Benutzer und speichert die Benutzerdaten in Firestore.
     * @param {Object} userDetails - Die Details des Benutzers.
     * @param {string} userDetails.firstName - Der Vorname des Benutzers.
     * @param {string} userDetails.lastName - Der Nachname des Benutzers.
     * @param {string} userDetails.email - Die E-Mail-Adresse des Benutzers.
     * @param {string} userDetails.password - Das Passwort des Benutzers.
     * @returns {Promise<User | null>} - Das registrierte Benutzerobjekt oder null bei einem Fehler.
     */
    async register({firstName, lastName, email, password}) {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const firebaseUser = userCredential.user;

            const user: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                firstName,
                lastName,
            };



            const userRef = doc(this.firestore, `users/${user.uid}`);
            await setDoc(userRef, user);

            // Start listening for changes to the user document
            const unsubscribe = onSnapshot(userRef, async (docSnapshot) => {
                if (!docSnapshot.exists()) {
                    // doc was deleted from FB, delete user from auth
                    if (this.auth.currentUser) {
                        await deleteUser(this.auth.currentUser);
                    }

                    unsubscribe();
                    await this.router.navigateByUrl('/login', {replaceUrl: true});
                }
            });

            return user;
        } catch (e) {
            return null;
        }
    }

    /**
     * @method login
     * @description Loggt einen Benutzer mit E-Mail und Passwort ein.
     * @param {Object} credentials - Die Anmeldeinformationen des Benutzers.
     * @param {string} credentials.email - Die E-Mail-Adresse des Benutzers.
     * @param {string} credentials.password - Das Passwort des Benutzers.
     * @returns {Promise<any>} - Das Anmeldeergebnis oder null bei einem Fehler.
     */
    async login({email, password}) {
        try {
            const user = await signInWithEmailAndPassword(
                this.auth,
                email,
                password
            );

            return user;
        } catch (e) {
            return null;
        }
    }

    /**
     * @method loginWithGoogle
     * @description Loggt einen Benutzer über Google ein.
     * @returns {Promise<any>} - Das Anmeldeergebnis oder ein Fehler.
     */
    //TODO: implement Google login // not working properly
    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            return await signInWithPopup(this.auth, provider);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * @method logout
     * @description Loggt den Benutzer aus und entfernt den Benutzernamen aus dem lokalen Speicher.
     */
    logout() {
        signOut(this.auth);
        localStorage.removeItem('userName');
    }


    /**
     * @method getUserDetails
     * @description Holt die Benutzerdetails aus Firestore.
     * @param {string} uid - Die Benutzer-ID.
     * @returns {Promise<any>} - Die Benutzerdaten oder null, wenn der Benutzer nicht existiert.
     */
    //TODO: herausfinden ob diese funktion nötig ist
    async getUserDetails(uid: string): Promise<any> {
        const userRef = doc(this.firestore, `users/${uid}`);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            return null;
        }
    }
}
