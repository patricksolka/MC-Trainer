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



@Injectable({
    providedIn: 'root'
})

export class UserService {

    public user: User;

    public userCollectionRef: CollectionReference<DocumentData>;
    public favCollectionRef : CollectionReference<DocumentData>;

    public favCategories: FavCategory[] = [];


    constructor(private firestore: Firestore, private alertController: AlertController) {
        this.userCollectionRef = collection(firestore, 'users');
        //this.favCollectionRef = collection(firestore,
        // `users/${this.user.uid}/favoriteCategories`);

        //const userDocRef = doc(this.userCollectionRef, 'uid');

        console.log(this.favCollectionRef);

    }

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

   /* async getFavCategories(uid: string): Promise<FavCategory> {
        try {
            const favCategoriesRef = collection(this.firestore, `users/${uid}/favoriteCategories`);
            const filterQuery = query(favCategoriesRef, orderBy('timestamp'));

            const favDocs = await getDocs(filterQuery);
            const favCategories: {
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
                favCategories.push({id: favoriteDoc.id, ...data});
            });
            console.log('test123', favDocs);
            console.log('Favoriten', favCategories);

            return favCategories;
        } catch (error) {
            console.error('Error fetching favorite categories:', error);
            return [];
        }
    }*/

    // listen to changes
    /*async getFavCategories(uid: string): Promise<FavCategory[]> {
        const favCategoriesRef = collection(this.firestore, `users/${uid}/favoriteCategories`);
        const filterQuery = query(favCategoriesRef, orderBy('timestamp'));

        return getDocs(filterQuery).then(snapshot => {
            const favCategories = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as FavCategory
            }));
           this.favCategories = favCategories;

            // Hier der console.log zum Überprüfen der geladenen Favoritenkategorien
            console.log('Geladene Favoritenkategorien:', favCategories);

            return this.favCategories;
        }).catch(error => {
            console.error('Fehler beim Laden der Favoritenkategorien:', error);
            throw error; // Falls gewünscht, um den Fehler weiterzuleiten
        });
    }*/

    getFavCategories(uid: string): Observable<FavCategory[]> {
        const favCategoriesRef = collection(this.firestore, `users/${uid}/favoriteCategories`);
        const filterQuery = query(favCategoriesRef, orderBy('timestamp'));

        return new Observable((observer) => {
            const unsubscribe = onSnapshot(filterQuery, (snapshot) => {
                const favCategories = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data() as FavCategory
                }));
                observer.next(favCategories);
            }, (error) => {
                observer.error(error);
            });

            return { unsubscribe };
        });
    }


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
                   /* completedCards: 0*/
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

    //TODO: Wird der noch gebraucht? evtl für das hinzufügen eines Favoriten
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