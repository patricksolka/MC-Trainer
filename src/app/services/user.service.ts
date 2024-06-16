import {AuthService} from "./auth.service";
import {deleteDoc, doc, Firestore} from "@angular/fire/firestore";
import {deleteUser} from "@angular/fire/auth";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class UserService{

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