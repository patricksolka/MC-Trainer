import {Injectable} from '@angular/core';
import {User} from '../models/user.model';
import {
    Auth,
    createUserWithEmailAndPassword, deleteUser,
    signInWithEmailAndPassword,
    signOut, GoogleAuthProvider, signInWithPopup
} from '@angular/fire/auth';
import {deleteDoc, doc, Firestore, setDoc, getDoc,onSnapshot, setDoc} from "@angular/fire/firestore";
import {UserService} from "./user.service";
import {Router} from "@angular/router";


@Injectable({
    providedIn: 'root'
})

export class AuthService {
    constructor(public auth: Auth, private firestore: Firestore, private userService: UserService, private router: Router) {
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
                },
                favoriteCategories: []
            };

            // move up if needed ^
            /* stats: {
                 completedQuizzes: 0,
                     correctAnswers: 0,
                     totalQuestions: 0,
             }*/


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

    //TODO: implement Google login // not working properly
    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(this.auth, provider);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    logout() {
        signOut(this.auth);
        localStorage.removeItem('userName');
    }
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
