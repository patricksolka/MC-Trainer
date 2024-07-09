/**
 * @fileoverview Diese Datei enthält den UserService, der die Verwaltung und Operationen von Benutzerdaten übernimmt.
 */

import {
    deleteDoc,
    doc,
    Firestore,
    getDoc,
    updateDoc,
    QueryDocumentSnapshot,
    SnapshotOptions,
    DocumentData,
    query,
    orderBy,
    onSnapshot,
    CollectionReference, collection, setDoc
} from "@angular/fire/firestore";
import {Injectable} from "@angular/core";
import {User} from "../models/user.model";
import {AlertController} from "@ionic/angular";
import {FavCategory} from "../models/categories.model";
import {Observable} from "rxjs";


/**
 * @class UserService
 * @description Dieser Service verwaltet die Benutzeroperationen und Interaktionen mit Firestore.
 */
@Injectable({
    providedIn: 'root'
})

export class UserService {
    public user: User;
    public userCollectionRef: CollectionReference<DocumentData>;
    public favCollectionRef : CollectionReference<DocumentData>;
    public favCategories: FavCategory[] = [];
    /**
     * @constructor
     * @param {Firestore} firestore - Firebase Firestore-Instanz.
     * @param {AlertController} alertController - Controller für Alerts.
     */
    constructor(private firestore: Firestore, private alertController: AlertController) {
        this.userCollectionRef = collection(firestore, 'users');
    }
    /**
     * @method getUser
     * @description Holt einen Benutzer anhand seiner UID aus Firestore.
     * @param {string} uid - Die Benutzer-ID.
     * @returns {Promise<User | null>} - Der Benutzer oder null, wenn er nicht existiert.
     */
    async getUser(uid: string) {
        const userRef = doc(this.firestore, `users/${uid}`);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const user = userSnap.data() as User;
            localStorage.setItem('userName', user.firstName);
            return user;
        } else {
            return null;
        }
    }

    /**
     * @method updateUser
     * @description Aktualisiert die Benutzerdaten in Firestore.
     * @param {User} user - Der Benutzer mit aktualisierten Daten.
     * @returns {Promise<void | null>} - Ein Promise, das aufgelöst wird, wenn der Benutzer erfolgreich aktualisiert wurde, oder null bei einem Fehler.
     */
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

    /**
     * @method deleteUser
     * @description Löscht einen Benutzer aus Firestore.
     * @param {string} uid - Die Benutzer-ID.
     * @returns {Promise<void | null>} - Ein Promise, das aufgelöst wird, wenn der Benutzer erfolgreich gelöscht wurde, oder null bei einem Fehler.
     */
    async deleteUser(uid: string) {
        try {
            const userRef = doc(this.firestore, `users/${uid}`);
            await deleteDoc(userRef);
        } catch (e) {
            console.error("Fehler beim Löschen des Benutzers: ", e);
            return null;
        }
    }

    /**
     * @method getFavCategories
     * @description Holt die Favoritenkategorien eines Benutzers.
     * @param {string} uid - Die Benutzer-ID.
     * @returns {Promise<Array<{id: string, name: string, timestamp: number, questionCount: number, completedCards: number}>>} - Eine Liste von Favoritenkategorien.
     */
    getFavCategories(uid: string): Observable<FavCategory[]> {
        const favCategoriesRef = collection(this.firestore, `users/${uid}/favoriteCategories`);
        const filterQuery = query(favCategoriesRef, orderBy('timestamp'));

        return new Observable((observer) => {
            const unsubscribe = onSnapshot(filterQuery, (snapshot) => {
                const favCategories = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data() as FavCategory,
                }));
                observer.next(favCategories);
            }, (error) => {
                observer.error(error);
            });
            return { unsubscribe };
        });
    }

    /**
     * @method addFavCategory
     * @description Fügt eine Kategorie zu den Favoriten eines Benutzers hinzu.
     * @param {string} uid - Die Benutzer-ID.
     * @param {string} categoryId - Die Kategorie-ID.
     * @param {string} categoryName - Der Name der Kategorie.
     * @param {number} questionCount - Die Anzahl der Fragen in der Kategorie.
     * @returns {Promise<void>} - Ein Promise, das aufgelöst wird, wenn die Kategorie erfolgreich hinzugefügt wurde.
     */
    async addFavCategory(uid: string, categoryId: string, categoryName: string, questionCount: number): Promise<void> {
        try {
            const favCategoriesRef = collection(this.firestore, `users/${uid}/favoriteCategories`);
            const docRef = doc(favCategoriesRef, categoryId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    name: categoryName,
                    timestamp: new Date().getTime(),
                    questionCount: questionCount,
                });
            }
        } catch (error) {
            console.error('Error adding category to favorites:', error);
            throw error;
        }
    }

    /**
     * @method removeFavCategory
     * @description Entfernt eine Kategorie aus den Favoriten eines Benutzers.
     * @param {string} uid - Die Benutzer-ID.
     * @param {string} categoryId - Die Kategorie-ID.
     * @returns {Promise<void>} - Ein Promise, das aufgelöst wird, wenn die Kategorie erfolgreich entfernt wurde.
     */
    async removeFavCategory(uid: string, categoryId: string): Promise<void> {
        try {
            const favCategoriesRef = collection(this.firestore, `users/${uid}/favoriteCategories`);
            const categoryRef = doc(favCategoriesRef, categoryId);
            await deleteDoc(categoryRef);
        } catch (error) {
            console.error('Error deleting favorite category:', error);
            throw new Error('Error deleting favorite category');
        }
    }
    private favConverter = {
        fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): FavCategory => {
            const result = Object.assign(new FavCategory(), snapshot.data(options));
            result.id = snapshot.id;
            return result;
        },
        toFirestore: (fav: FavCategory): DocumentData => {
            const copy = {...fav};
            delete copy.id;
            return copy;
        }
    };

    /**
     * @constant userConverter
     * @description Konverter für die Umwandlung von Firestore-Dokumenten in User-Objekte und umgekehrt.
     */
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
    /**
     * @method deleteAlert
     * @description Zeigt einen Bestätigungs-Alert an und entfernt eine Favoritenkategorie, wenn bestätigt.
     * @param {string} uid - Die Benutzer-ID.
     * @param {string} categoryId - Die Kategorie-ID.
     */
    async deleteAlert(uid: string, categoryId: string) {
            const alert = await this.alertController.create({
                header: 'Favorit entfernen',
                message: `Möchten Sie dieses Modul wirklich aus Ihren Favoriten entfernen?`,
                buttons: [
                    {
                        text: 'Abbrechen',
                        role: 'cancel',
                        handler: () => {
                            console.log('Entfernen abgebrochen');
                        }
                    },
                    {
                        text: 'Entfernen',
                        handler: async () => {
                            try {
                                await this.removeFavCategory(uid, categoryId);
                            } catch (error) {
                                console.error('Fehler beim Entfernen des Favoriten', error);
                            }
                        }
                    }
                ]
            });
        await alert.present();
    }
    /**
     * @method showAlert
     * @description Zeigt einen Alert mit einer benutzerdefinierten Nachricht an.
     * @param {string} header - Der Header des Alerts.
     * @param {string} message - Die Nachricht des Alerts.
     */
    async showAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                    },
                },
            ],
        });
        await alert.present();
    }
}