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
    getDocs, CollectionReference, collection, setDoc, addDoc
} from "@angular/fire/firestore";
import {Injectable} from "@angular/core";
import {User} from "../models/user.model";
import {AlertController} from "@ionic/angular";

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
    //get user by ID
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

    //mit subcollection
    /*async getFavCategories(uid: string): Promise<{ id: string; name: string; timestamp: number; questionCount: number }[]> {
        try {
            const favCategoriesRef = this.getFavcollectionRef(uid);
            const querySnapshot = await getDocs(favCategoriesRef);

            const favoriteCategories: { id: string; name: string; timestamp: number; questionCount: number }[] = [];
            querySnapshot.forEach(doc => {
                const data = doc.data() as { name: string; timestamp: number; questionCount: number };
                favoriteCategories.push({ id: doc.id, ...data });
            });

            console.log('Favoriten', favoriteCategories);
            return favoriteCategories;
        } catch (error) {
            console.error('Error fetching favorite categories:', error);
            return [];
        }
    }*/
    /**
     * @method getFavCategories
     * @description Holt die Favoritenkategorien eines Benutzers.
     * @param {string} uid - Die Benutzer-ID.
     * @returns {Promise<Array<{id: string, name: string, timestamp: number, questionCount: number, completedCards: number}>>} - Eine Liste von Favoritenkategorien.
     */
    async getFavCategories(uid: string): Promise<{
        id: string;
        name: string;
        timestamp: number;
        questionCount: number,
        completedCards: number
    }[]> {
        try {
            const favCategoriesRef = collection(this.firestore, `users/${uid}/favoriteCategories`);
            const filterQuery = query(favCategoriesRef, orderBy('timestamp'));

            const favDocs = await getDocs(filterQuery);
            const categories: {
                id: string;
                name: string;
                timestamp: number;
                questionCount: number,
                completedCards: number
            }[] = [];
            favDocs.forEach(favoriteDoc => {
                const data = favoriteDoc.data() as {
                    name: string;
                    timestamp: number;
                    questionCount: number,
                    completedCards: number
                };
                categories.push({id: favoriteDoc.id, ...data});
            });

            return categories;
        } catch (error) {
            console.error('Error fetching favorite categories:', error);
            return [];
        }
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
    //mit subcollection
    async addFavCategory(uid: string, categoryId: string, categoryName: string, questionCount: number): Promise<void> {
        try {
            /*const favCategoriesRef = this.getFavcollectionRef(uid);*/
            const favCategoriesRef = collection(this.firestore, `users/${uid}/favoriteCategories`);
            const docRef = doc(favCategoriesRef, categoryId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    name: categoryName,
                    timestamp: new Date().getTime(),
                    questionCount: questionCount,
                    //isFavorite: true
                });

                console.log(`Category ${categoryId} added to favorites for user ${uid}`);
            } else {
                console.log(`Category ${categoryId} is already a favorite for user ${uid}`);
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
    //Subcollection
    async removeFavCategory(uid: string, categoryId: string): Promise<void> {
        try {
            //const favCategoriesRef = this.getFavcollectionRef(uid);
            const favCategoriesRef = collection(this.firestore, `users/${uid}/favoriteCategories`);
            const categoryRef = doc(favCategoriesRef, categoryId);
            await deleteDoc(categoryRef);
            console.log('Favorite category deleted', categoryId);
        } catch (error) {
            console.error('Error deleting favorite category:', error);
            throw new Error('Error deleting favorite category');
        }
    }

    /**
     * @constant userConverter
     * @description Konverter für die Umwandlung von Firestore-Dokumenten in User-Objekte und umgekehrt.
     */

    private userConverter = {
        fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): User => {
            const user = Object.assign(new User(), snapshot.data(options));
            user.uid = snapshot.id;
            // const favoriteCategories = snapshot.get('favoriteCategories') || {};
            // user.favoriteCategories = Object.entries(favoriteCategories).map(([id, data]) => {
            //     const favData = data as { name: string; timestamp: number, questionCount: number};
            //     return {
            //         id,
            //         name: favData.name || 'Unknown',
            //         timestamp: favData.timestamp || 0,
            //         questionCount: favData.questionCount || 0
            //     };
            // });
            return user;
        },
        toFirestore: (user: User): DocumentData => {
            const copy = {...user};
            delete copy.uid;
            return copy;
        }
    };

    /*getFavcollectionRef(userId: string): CollectionReference<DocumentData> {
        const userRef = doc(this.firestore, 'users', userId);
        return collection(userRef, 'favoriteCategories');
    }*/

    /**
     * @method deleteAlert
     * @description Zeigt einen Bestätigungs-Alert an und entfernt eine Favoritenkategorie, wenn bestätigt.
     * @param {string} uid - Die Benutzer-ID.
     * @param {string} categoryId - Die Kategorie-ID.
     */
    async deleteAlert(uid: string, categoryId: string) {
            const alert = await this.alertController.create({
                header: 'Favorit entfernen',
                message: `Möchten Sie dieses Modul wirklich aus Ihren Favoriten entfernen? Ihr Fortschritt geht dadurch verloren.`,
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
                                console.log('Favorit entfernt');
                                // Optional: Rückmeldung geben oder Liste der Favoriten aktualisieren
                            } catch (error) {
                                console.error('Fehler beim Entfernen des Favoriten', error);
                                // Optional: Fehlermeldung anzeigen
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
                        //this.credentials.reset();
                    },
                },
            ],
        });

        await alert.present();
    }

    //als Datenfeld
    /*async getFavCategories(uid: string): Promise<{ id: string; name: string; timestamp: number }[] | null> {
        try {
            const userRef = doc(this.userCollectionRef, uid).withConverter(this.userConverter);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists) {
                return []; // User not found
            }

            const user = userSnap.data();
            if (user) {
                const favoriteCategoriesArray: { id: string; name: string; timestamp: number }[] = [];

                // Check if favoriteCategories exists and is not null
                if (user.favoriteCategories) {
                    // Push each category object into the array
                    for (const categoryId in user.favoriteCategories) {
                        const category = user.favoriteCategories[categoryId];
                        favoriteCategoriesArray.push(category);
                    }
                }

                console.log('Favoriten', favoriteCategoriesArray);
                return favoriteCategoriesArray; // Return the array of favorite categories
            } else {
                return []; // Handle case where user data might be empty after conversion
            }
        } catch (error) {
            console.error('Error fetching favorite categories:', error);
            return [];
        }
    }*/

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
    /* async addFavCategory(uid: string, categoryId: string, categoryName: string, questionCount: number): Promise<void> {
         try {
             const userRef = doc(this.firestore, `users/${uid}`);
             const userDoc = await getDoc(userRef);

             if (userDoc.exists()) {
                 const userData = userDoc.data() as User;
                 // Update the userData with new favorite category, name, and timestamp
                 userData.favoriteCategories = {
                     ...userData.favoriteCategories,
                     [categoryId]: {
                         name: categoryName,
                         timestamp: new Date().getTime(),
                         questionCount: questionCount
                     }
                 };


                 const userDataFirestore = this.userConverter.toFirestore(userData);

                 // Update the Firestore document
                 await updateDoc(userRef, userDataFirestore);

                 console.log(`Category ${categoryId} added to favorites for user ${uid}`);
             } else {
                 throw new Error('User not found.');
             }
         } catch (error) {
             console.error('Error adding category to favorites:', error);
             throw error;
         }
     }*/

    /*async removeFav(uid: string, categoryId: string): Promise<void> {
        try {
            const userRef = doc(this.firestore, 'users', uid);
            await updateDoc(userRef, {
                [`favoriteCategories.${categoryId}`]: deleteField()
            });
            console.log('Favorite category deleted', categoryId);
        } catch {
            throw new Error('Error deleting favorite category');
        }
    }*/


}