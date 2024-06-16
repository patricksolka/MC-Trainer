import {AuthService} from "./auth.service";
import {deleteDoc, doc, Firestore, getDoc} from "@angular/fire/firestore";
import {deleteUser} from "@angular/fire/auth";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class UserService{

    //get user by ID
    async getUser(uid: string) {
        try {
            const userRef = doc(this.firestore, `users/${uid}`);
            const userSnap = await getDoc(userRef);


            if (userSnap.exists()) {
                const userData = userSnap.data();
                console.log(userData);
                return userData;
                /*return userSnap.data();*/
            } else {
                console.error("Kein Benutzer mit dieser UID gefunden: ", uid);
                return null;
            }
        } catch (e) {
            console.error("Fehler beim Abrufen des Benutzers: ", e);
            return null;
        }
    }

    async deleteUser(uid: string) {
        try {
            const userRef = doc(this.firestore, `users/${uid}`);
            await deleteDoc(userRef);
            await deleteUser(this.authService.auth.currentUser);
        }
        catch(e){
            console.error("Fehler beim Löschen des Benutzers: ", e);
            return null;
        }
    }
    constructor(private authService: AuthService, private firestore: Firestore ) { }
}