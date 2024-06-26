//import {AuthService} from "./auth.service";
import {
    deleteDoc,
    doc,
    Firestore,
    getDoc,
    updateDoc,
    QueryDocumentSnapshot,
    SnapshotOptions,
    DocumentData,
    arrayUnion,
    arrayRemove,
    deleteField,
    query,
    orderBy,
    onSnapshot,
    getDocs, CollectionReference, collection
} from "@angular/fire/firestore";
import {Injectable} from "@angular/core";
import {User} from "../models/user.model";
import {AlertController} from "@ionic/angular";
import {Category} from "../models/categories.model";


@Injectable({
    providedIn: 'root'
})

export class UserService {

    user: User;
    userCollectionRef: CollectionReference<DocumentData>;

    //get user by ID
    async getUser(uid: string) {
        const userRef = doc(this.firestore, `users/${uid}`);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const user = userSnap.data() as User;
            localStorage.setItem('userName', user.firstName);
            return user;
           /* return {
                user,
                favoriteCategories: user.favoriteCategories || [] // Ensure favoriteCategories is defined
            };*/
        } else {
            return null;
        }
    }

    /*async getFavoriteModules(userId: string): Promise<{ id: string, timestamp: number }[]> {
        const userDoc = doc(this.firestore, `users/${userId}`);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
            const user = this.userConverter.fromFirestore(userSnap, {});
            console.log(user.favoriteCategories);
            return user.favoriteCategories || [];
        } else {
            return [];
        }
    }
*/
   /* async getFavoriteModules(userId: string): Promise<{ id: string }[]> {
        try {
            const userRef = doc(this.firestore, `users/${userId}`);
            const userSnap = await getDoc(userRef);
            const favoriteModules: { id: string }[] = [];


            if (userSnap.exists()) {
                const userData = userSnap.data() as User;
                const favoriteModules: { id: string}[] = [];

                Object.keys(userData.favoriteCategories).forEach(categoryId => {
                    // Füge das Objekt { id: categoryId } zum favoriteModules Array hinzu
                    favoriteModules.push({ id: categoryId });
                });

                console.log('Favorite categories:', favoriteModules);
                return favoriteModules;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching favorite categories:', error);
            return [];
        }
    }*/

   /* async getFavCategories(userId: string): Promise<{ id: string; name: string }[]> {
        try {
            const userRef = doc(this.firestore, `users/${userId}`);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data() as User;
                const favCategories: { id: string, name: string }[] = [];


                // Iterate through each favorite category in userData.favoriteCategories
                for (const categoryId in userData.favoriteCategories) {
                    if (userData.favoriteCategories.hasOwnProperty(categoryId)) {
                        const categoryName = userData.favoriteCategories[categoryId].name || 'Unknown'; // Default to 'Unknown' if name is undefined
                        console.log('name', categoryName);
                        favCategories.push({
                            id: categoryId,
                            name: categoryName
                        });

                    }
                }
                return favCategories;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching favorite categories:', error);
            return [];
        }
    }*/

   /* async getFavCategories(uid: string): Promise<{ id: string; name: string; timestamp: number }[] | null> {
        try {
            const userRef = doc(this.userCollectionRef, uid).withConverter(this.userConverter);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists) {
                return []; // User not found
            }

            const user = userSnap.data();
            if (user) {
                console.log('Favoriten', user.favoriteCategories);
                return user.favoriteCategories || []; // Return empty array if favoriteCategories is missing
            } else {
                return []; // Handle case where user data might be empty after conversion
            }
        } catch (error) {
            console.error('Error fetching favorite categories:', error);
            return [];
        }
    }
*/

    async getFavCategories(uid: string): Promise<{ id: string; name: string; timestamp: number }[] | null> {
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
            const favoriteCategories = snapshot.get('favoriteCategories') || {};
            user.favoriteCategories = Object.entries(favoriteCategories).map(([id, data]) => {
                const favData = data as { name: string; timestamp: number, questionCount: number};
                return {
                    id,
                    name: favData.name || 'Unknown',
                    timestamp: favData.timestamp || 0,
                    questionCount: favData.questionCount || 0
                };
            });
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

    /*async getFavoriteModules(uid: string): Promise<{ id: string, timestamp: number }[]> {
        const user = await this.getUser(uid);
        if (user) {
            const favoriteCategoriesWithTimestamps = user.favoriteCategoriesWithTimestamps || [];
            // Convert the object to an array of { id, timestamp }
            return Object.entries(favoriteCategoriesWithTimestamps).map(([id, timestamp]) => ({ id, timestamp }));
        } else {
            return [];
        }
    }*/

   /* async getFavoriteModules(userId: string): Promise<{ id: string, timestamp: number }[]> {
        const userDoc = doc(this.firestore, `users/${userId}`);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
            const userData = userSnap.data() as User;
            console.log(userData.favoriteCategories);
            return userData.favoriteCategories || [];
        } else {
            return [];
        }
    }*/

   /* async getFavoriteModules(userId: string): Promise<Category[]> {
        const userDoc = doc(this.firestore, `users/${userId}`);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
            const userData = userSnap.data() as User;
            const favoriteCategoryIds = userData.favoriteCategories || [];
            const favoriteCategories: Category[] = [];
            for (const categoryId of favoriteCategoryIds) {
                const categoryDoc = doc(this.firestore, `categories/${categoryId}`);
                const categorySnap = await getDoc(categoryDoc);
                if (categorySnap.exists()) {
                    const categoryData = categorySnap.data() as Category;
                    favoriteCategories.push(categoryData);
                }
            }
            return favoriteCategories;
        } else {
            return [];
        }
    }*/



    /*async addFavoriteModule(uid: string, categoryId: string): Promise<void> {
        const userDoc = doc(this.firestore, `users/${uid}`);
        const timestamp = Date.now();
        await updateDoc(userDoc, {
            [`favoriteCategories.${categoryId}`]: timestamp
        });
    }*/

    /*async addFavUser(uid: string, categoryId: string): Promise<void> {
        try {
           /!* const user = await this.getUser(uid);
            console.log(this.user);
            if (!user) {
                throw new Error('User not found.');
            }*!/
            const userRef = doc(this.firestore, `users/${uid}`);
            await updateDoc(userRef, {
                [`favoriteCategories.${categoryId}`]: true
            });
            console.log(`Category ${categoryId} added to favorites for user ${uid}`);
        } catch (error) {
            console.error('Error adding category to favorites:', error);
            throw error; // Fehler weitergeben, falls nötig
        }
    }*/

    /*async addFavUser(uid: string, categoryId: string): Promise<void> {
        try {
            const userRef = doc(this.firestore, `users/${uid}`);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data() as User;
                // Update the userData with new favorite category and timestamp
                userData.favoriteCategories = {
                    ...userData.favoriteCategories,
                    [categoryId]: {
                        timestamp: new Date().getTime()  // Add current timestamp
                    }
                };

                // Use userConverter to convert userData to Firestore format
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

    //mit name
    async addFavCategory(uid: string, categoryId: string, categoryName: string, questionCount: number): Promise<void> {
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
    }


    /*async removeFavoriteModule(uid: string, categoryId: string): Promise<void> {
        const userDoc = doc(this.firestore, `users/${uid}`);
        await updateDoc(userDoc, {
            [`favoriteCategoriesWithTimestamps.${categoryId}`]: deleteField()
        });
    }*/

    async removeFav(uid: string, categoryId: string): Promise<void> {
        try {
            const userRef = doc(this.firestore, 'users', uid);
            await updateDoc(userRef, {
                [`favoriteCategories.${categoryId}`]: deleteField()
            });
            console.log('Favorite category deleted', categoryId);
        } catch {
            throw new Error('Error deleting favorite category');
        }
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
        this.userCollectionRef = collection(firestore, 'users');
    }
}