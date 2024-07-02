import {Injectable} from '@angular/core';
import {
    collection,
    CollectionReference,
    doc,
    DocumentData,
    Firestore,
    getDoc, getDocs, onSnapshot,
    QueryDocumentSnapshot,
    setDoc,
    SnapshotOptions, Unsubscribe,
    updateDoc
} from '@angular/fire/firestore';
import {Card} from "../models/card.model";
import {UserService} from "./user.service";
import {AuthService} from "./auth.service";
import {Stats} from "../models/stats.model";


@Injectable({
    providedIn: 'root'
})
export class TotalStatsService {
    private totalCorrectAnswers: number = 0;
    private totalIncorrectAnswers: number = 0;
    private subscription: Unsubscribe | null = null;

    private userCollection: CollectionReference<DocumentData>;

    constructor(private firestore: Firestore, private userService: UserService, private authService: AuthService) {
        this.userCollection = collection(firestore, 'users') as CollectionReference<DocumentData>;

    }

    //Funktioniert auch
    async persistStats(uid: string, categoryId: string, stats: Stats) {
        const statsCollectionRef = doc(this.firestore, `users/${uid}/stats/${categoryId}`);

        try {
            const docSnap = await getDoc(statsCollectionRef);

            if (docSnap.exists()) {
                const currentStats = docSnap.data() as Stats;
                const updatedStats = {
                    correctAnswers: currentStats.correctAnswers + stats.correctAnswers,
                    incorrectAnswers: currentStats.incorrectAnswers + stats.incorrectAnswers,
                    completedQuizzes: currentStats.completedQuizzes + stats.completedQuizzes
                };
                await updateDoc(statsCollectionRef, updatedStats);
                console.log("Existing document updated with stats:", updatedStats);
            } else {
                const statsData: DocumentData = {
                    ...this.statsConverter.toFirestore(stats),
                    completedQuizzes: 1 // Initialisierung von completedQuizzes auf 1 beim Erstellen eines neuen Dokuments
                };
                await setDoc(statsCollectionRef, statsData);
                console.log("New document created with stats:", statsData);
            }
        } catch (e) {
            console.error("Error persisting stats:", e);
        }
    }

    async getStats(uid: string, categoryId: string) {
        const statsCollectionRef = doc(this.firestore, `users/${uid}/stats/${categoryId}`);
        //const docSnap = await getDoc(doc(statsCollectionRef, categoryId));

        const docSnap = await getDoc(statsCollectionRef);

        if (docSnap.exists()) {
            return docSnap.data() as Stats;
        } else {
            return null;
        }
    }

    async getStatsById(uid: string, categoryId: string) {
        const statsCollectionRef = doc(this.firestore, `users/${uid}/stats/${categoryId}`);
        const docSnap = await getDoc(statsCollectionRef);

        if (docSnap.exists()) {
            const result = docSnap.data() as Stats;
            console.log("Retrieved stats for id:", result);
            return result;
        } else {
            console.log("No stats found for id bdbdb:"); // Hinzugefügte Protokollierung
            return null;
        }

    }

    //TODO: Subscription evtl rausnehemn
    async calculateTotalStats(uid: string) {
        const statsCollectionRef = collection(this.firestore, `users/${uid}/stats/`);
        const refWithConverter = statsCollectionRef.withConverter(this.statsConverter);
       // const docSnap = await getDocs(statsCollectionRef);
        let totalCorrectAnswers = 0;
        let totalIncorrectAnswers = 0;
        let completedQuizzes = 0;

        this.subscription = onSnapshot(refWithConverter, (snapshot) => {
            snapshot.docs.forEach(docData => {
                console.log(docData.data());
            });
        });

        const statsDocs = await getDocs(refWithConverter);
        statsDocs.forEach((doc) => {
            const stats = doc.data();
            totalCorrectAnswers += stats.correctAnswers || 0;
            totalIncorrectAnswers += stats.incorrectAnswers || 0;
            completedQuizzes += stats.completedQuizzes || 0;
        });

/*
        docSnap.forEach((doc) => {
            const data = this.statsConverter.fromFirestore(doc, {}); // Verwenden Sie den Konverter hier
            totalCorrectAnswers += data.correctAnswers;
            totalIncorrectAnswers += data.incorrectAnswers;
            console.log("Ausgabe:", data);
        });*/

        console.log("Ausgabe:", totalCorrectAnswers, totalIncorrectAnswers);
        return {
            totalCorrectAnswers,
            totalIncorrectAnswers,
            completedQuizzes
        };
    }

    //TODO: Ursprünglich
    /* async persistTotalStats(uid: string, correct: number, incorrect: number) {
         const userDoc = doc(this.firestore, `users/${uid}`);
         const userSnap = await getDoc(userDoc);

         if (userSnap.exists()) {
             const data = userSnap.data();
             const totalCorrectAnswers = data?.['totalCorrectAnswers'] || 0;
             const totalIncorrectAnswers = data?.['totalIncorrectAnswers'] || 0;

             const persistCorrectAnswers = totalCorrectAnswers + correct;
             const persistIncorrectAnswers = totalIncorrectAnswers + incorrect;

             await updateDoc(userDoc, {
                 totalStats: {
                     totalCorrectAnswers: persistCorrectAnswers,
                     totalIncorrectAnswers: persistIncorrectAnswers,
                 }
             });
         } else {
             console.log("No such document!");
         }
     }*/

    /* async persistTotalStats1(uid: string, correct: number, incorrect: number): Promise<void> {
         try {
             const userDocRef = doc(this.firestore, `users/${uid}`);
             const userSnap = await getDoc(userDocRef);

             if (userSnap.exists()) {
                 const data = userSnap.data() as TotalStats;
                 const updatedStats: TotalStats = {
                     totalCorrectAnswers: data.totalCorrectAnswers + correct,
                     totalIncorrectAnswers: data.totalIncorrectAnswers + incorrect,
                     completedQuizzes: data.completedQuizzes || 0 // Sicherstellen, dass completedQuizzes vorhanden ist
                 };
                 await updateDoc(userDocRef, { totalStats: updatedStats });
                 console.log('Total stats updated successfully:', updatedStats);
             } else {
                 const totalStats: TotalStats = {
                     totalCorrectAnswers: correct,
                     totalIncorrectAnswers: incorrect,
                     completedQuizzes: +1
                 };
                 await setDoc(userDocRef, { totalStats: totalStats });
                 console.log('New total stats document created:', totalStats);
             }
         } catch (error) {
             console.error('Error persisting total stats:', error);
             throw error; // Fehler weiterwerfen für die weitere Fehlerbehandlung oder Protokollierung
         }
     }

     async persistTotalStats(uid: string, correct: number, incorrect: number): Promise<void> {
         try {
             const userDocRef = doc(this.firestore, `users/${uid}`);
             const userSnap = await getDoc(userDocRef);

             if (userSnap.exists()) {
                 const data = this.totalStatsConverter.fromFirestore(userSnap, {});
                 const updatedStats: TotalStats = {
                     totalCorrectAnswers: (data.totalCorrectAnswers || 0) + correct,
                     totalIncorrectAnswers: (data.totalIncorrectAnswers || 0) + incorrect,
                     completedQuizzes: (data.completedQuizzes || 0) +1
                 };

                 await updateDoc(userDocRef, { totalStats: this.totalStatsConverter.toFirestore(updatedStats) });
             } else {
                 const totalStats: TotalStats = {
                     totalCorrectAnswers: correct,
                     totalIncorrectAnswers: incorrect,
                     completedQuizzes: +1
                 };
                 await setDoc(userDocRef, { totalStats: this.totalStatsConverter.toFirestore(totalStats) });
             }
         } catch (error) {
             console.error('Error persisting total stats:', error);
             throw error;
         }
     }*/

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription();
            this.subscription = null;
        }
    }


    //Gesamtstatistik abrufen
    /*async getTotalStats(uid: string) {
        console.log('totalStats called')
        const userDoc = doc(this.firestore, `users/${uid}`);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
            return this.totalStatsConverter.fromFirestore(userSnap, {});
           /!* const data = userSnap.data();
            console.log("Data:", data)
            const totalStats = data?.['totalStats'] || {
                totalCorrectAnswers: 0,
                totalIncorrectAnswers: 0
            };

            return {
                totalCorrectAnswers: totalStats.totalCorrectAnswers,
                totalIncorrectAnswers: totalStats.totalIncorrectAnswers,
                //completedQuizzes: totalStats.completedQuizzes
            };*!/

        } else {
            console.log("No such document!");
            return null;
        }
    }
*/
    private statsConverter = {
        fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Stats => {
            const data = snapshot.data(options);
            return Object.assign(new Stats(), data);
        },
        toFirestore: (stats: Stats): DocumentData => {
            return {...stats};
        }
    };



    resetStats() {
        this.totalCorrectAnswers = 0;
        this.totalIncorrectAnswers = 0;
        //this.updatedateFirebaseStats(this.authService.auth.currentUser.uid, "correctAnswers", 0);
        //this.updatedateFirebaseStats(this.authService.auth.currentUser.uid,
        // "incorrectAnswers", 0);
    }
}







