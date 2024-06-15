import {Injectable} from '@angular/core';
import { User } from '../models/user.model';
//import { HttpClient } from '@angular/common/http';
import {
    Auth,
    createUserWithEmailAndPassword, deleteUser,
    signInWithEmailAndPassword,
    signOut
} from '@angular/fire/auth';
import {deleteDoc, doc, Firestore, setDoc} from "@angular/fire/firestore";


@Injectable({
    providedIn: 'root'
})

export class AuthService {
    constructor(public auth: Auth, private firestore: Firestore) {}

    async register({ firstName, lastName, email, password }) {
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
    /*async register({ firstName, lastName, email, password }) {
        try {
            const userCredential= await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;

            const userRef = doc(this.firestore, `users/${user.uid}`);
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                firstName,
                lastName,
            });
            return user;
            } catch (e) {
            return null;
        }
    }*/


    async login({email, password}) {
        try {
            const user= await signInWithEmailAndPassword(
                this.auth,
                email,
                password
            );
            return user;
        } catch (e) {
            return null;
        }
    }

    logout(){
        signOut(this.auth)
    }

    async deleteAccount(uid: string) {
        try {
            const userRef = doc(this.firestore, `users/${uid}`);
            await deleteDoc(userRef);
            await deleteUser(this.auth.currentUser);
        }
        catch(e){
            console.error("Fehler beim Löschen des Benutzers: ", e);
            return null;
        }
    }
   /* async deleteAccount(uid: string) {
        try{
            const userRef = doc(this.firestore, `users/${uid}`);
            await deleteDoc(userRef);
            await deleteUser(this.auth.currentUser);
        }
        catch(e){
            return null;
        }
    }*/
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


    /*
    private users: User[] = [];
    private currentUser: User | null = null;

    constructor(private http: HttpClient) {
        this.loadUsers();
    }

    private loadUsers() {
        this.http.get<User[]>('assets/users.json').subscribe((data: User[]) => {
            this.users = data;
        });
    }

    register(user: User): boolean {
        if (this.users.find(u => u.username === user.username)) {
            return false; // User already exists
        }
        this.users.push(user);
        return true;
    }

    login(username: string, password: string): boolean {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = user;
            return true;
        }
        return false;
    }

    logout(): void {
        this.currentUser = null;
    }

    resetPassword(username: string, newPassword: string): boolean {
        const user = this.users.find(u => u.username === username);
        if (user) {
            user.password = newPassword;
            return true;
        }
        return false;
    }

    isAuthenticated(): boolean {
        return this.currentUser !== null;
    }
}
*/

}
