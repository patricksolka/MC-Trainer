import {Injectable} from '@angular/core';
import {User} from '../models/user.model';
//import { HttpClient } from '@angular/common/http';
import {
    Auth,
    createUserWithEmailAndPassword, deleteUser,
    signInWithEmailAndPassword,
    signOut
} from '@angular/fire/auth';
import {deleteDoc, doc, Firestore, setDoc, getDoc} from "@angular/fire/firestore";
import {UserService} from "./user.service";


@Injectable({
    providedIn: 'root'
})

export class AuthService {
    constructor(public auth: Auth, private firestore: Firestore, private userService: UserService) {
    }

    async register({firstName, lastName, email, password}) {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const firebaseUser = userCredential.user;

            const user: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                firstName,
                lastName,
                stats: {
                    completedQuizzes: 0,
                    correctAnswers: 0,
                    totalQuestions: 0,
                }
            };

            const userRef = doc(this.firestore, `users/${user.uid}`);
            await setDoc(userRef, user);

            return user;
        } catch (e) {
            return null;
        }
    }


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

    logout() {
        signOut(this.auth);
        localStorage.removeItem('userName');
    }

    async getUserDetails(uid: string): Promise<any> {
        const userRef = doc(this.firestore, `users/${uid}`);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            return null;
        }
    }


//evtl um Änderungen in der db zu beobachten
    /* const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
         if (!docSnapshot.exists()) {
             // Das Dokument wurde gelöscht, löschen Sie den Benutzer aus der Authentifizierung
             deleteUser(this.auth.currentUser).catch((error) => {
                 console.error("Fehler beim Löschen des Benutzers aus der Authentifizierung: ", error);
             });
             // Beenden Sie das Abhören von Änderungen, nachdem der Benutzer gelöscht wurde
             unsubscribe();
         }
     });*/
}