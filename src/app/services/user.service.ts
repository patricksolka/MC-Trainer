//import {AuthService} from "./auth.service";
import {
    deleteDoc, doc, Firestore, getDoc, updateDoc, QueryDocumentSnapshot,
    SnapshotOptions, DocumentData, arrayUnion, arrayRemove, deleteField } from "@angular/fire/firestore";
import {Injectable} from "@angular/core";
import {User} from "../models/user.model";
import {AlertController} from "@ionic/angular";


@Injectable({
    providedIn: 'root'
})

export class UserService {

    user: User;

    //get user by ID
    async getUser(uid: string) {
        const userRef = doc(this.firestore, `users/${uid}`);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const user = userSnap.data() as User;
            localStorage.setItem('userName', user.firstName);
            return user;
            /*return {
                user,
                favoriteCategories: user.favoriteCategories || [] // Ensure favoriteCategories is defined
            };*/
        } else {
            return null;
        }
    }

    // ohne converter
    /* async updateUser(user: User) {
         try {
             const userRef = doc(this.firestore, `users/${user.uid}`);
             await updateDoc(userRef, user);
         } catch (e) {
             console.error("Fehler beim Aktualisieren des Benutzers: ", e);
             return null;
         }
     }
 */

    //mit converter
    async updateUser(user: User) {
        try {
            const userData = this.userConverter.toFirestore(user);
            const userRef = doc(this.firestore, 'users', user.uid);
            await updateDoc(userRef, userData);
        } catch (e) {
            console.log("Fehler beim Aktualisieren des Benutzers: ", e);
            return null;
        }
    }

    private userConverter = {
        fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): User => {
            const user = Object.assign(new User(), snapshot.data(options));
            user.uid = snapshot.id;
            return user;
        },
        toFirestore: (user: User): DocumentData => {
            const copy = {...user};
            delete copy.uid;
            return copy;
        }
    };

    async deleteUser(uid: string){
        try{
            const userRef = doc(this.firestore, `users/${uid}`);
            await deleteDoc(userRef);
        } catch (e){
            console.error("Fehler beim Löschen des Benutzers: ", e);
            return null;
        }
    }

    async getFavoriteModules(uid: string): Promise<{ id: string, timestamp: number }[]> {
        const user = await this.getUser(uid);
        if (user) {
            const favoriteCategoriesWithTimestamps = user.favoriteCategoriesWithTimestamps || [];
            // Convert the object to an array of { id, timestamp }
            return Object.entries(favoriteCategoriesWithTimestamps).map(([id, timestamp]) => ({ id, timestamp }));
        } else {
            return [];
        }
    }

    async addFavoriteModule(uid: string, categoryId: string): Promise<void> {
        const userDoc = doc(this.firestore, `users/${uid}`);
        const timestamp = Date.now();
        await updateDoc(userDoc, {
            [`favoriteCategoriesWithTimestamps.${categoryId}`]: timestamp
        });
    }

    async removeFavoriteModule(uid: string, categoryId: string): Promise<void> {
        const userDoc = doc(this.firestore, `users/${uid}`);
        await updateDoc(userDoc, {
            [`favoriteCategoriesWithTimestamps.${categoryId}`]: deleteField()
        });
    }


    async showAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        //this.credentials.reset();
                    },
                },
            ],
        });

        await alert.present();
    }

    constructor(private firestore: Firestore,  private alertController: AlertController) {
    }
}