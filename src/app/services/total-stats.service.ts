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
import {CardComponent} from "../components/card/card.component";
import {AchievementService} from "./achievement.service";
import {ToastController} from "@ionic/angular/standalone";


@Injectable({
    providedIn: 'root'
})
export class TotalStatsService {
    private totalCorrectAnswers: number = 0;
    private totalIncorrectAnswers: number = 0;
    private subscription: Unsubscribe | null = null;

    userCollectionRef: CollectionReference<DocumentData>;

    constructor(private firestore: Firestore, private userService: UserService, private authService: AuthService) {
        this.userCollectionRef = collection(firestore, 'users') as CollectionReference<DocumentData>;
    }

    updateStats(correct: number, incorrect: number) {
        this.totalCorrectAnswers += correct;
        this.totalIncorrectAnswers += incorrect;
        console.log(this.authService.auth.currentUser.uid);
    }

    checkForNewAchievements(stats) {
        const newAchievements = this.achievementService.checkAchievements(stats);
        this.showAchievementToast(newAchievements);
    }

    async showAchievementToast(achievements) {
        const toasts = [];
        for(const achievement of achievements) {
            const toast = await this.toastController.create({
                header: 'Congratulations!',
                message: `${achievement.name}: ${achievement.description}`,
                duration: 2000, // Toast duration in milliseconds
                position: 'top', // Position of the toast
            });
            toasts.push(toast);
        }

        for (const toast of toasts) {
            await toast.present();
            await this.delay(1000);
        }
    }
    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //Funktioniert auch
    async persistStats(uid: string, categoryId: string, stats: Stats) {
        const statsCollectionRef = doc(this.userCollectionRef, uid, 'stats', categoryId);

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
            /*
            const newDocSnap = await getDoc(statsCollectionRef);
            const currentStats = newDocSnap.data() as Stats;
            const updatedStats = {
                correctAnswers: currentStats.correctAnswers,
                incorrectAnswers: currentStats.incorrectAnswers,
                completedQuizzes: currentStats.completedQuizzes
            };

             */
            const newStats = await this.calculateTotalStats(this.authService.auth.currentUser.uid);
            const updatedStats = {
                correctAnswers: newStats.totalCorrectAnswers,
                incorrectAnswers: newStats.totalIncorrectAnswers,
                completedQuizzes: newStats.completedQuizzes
            };
            this.checkForNewAchievements(updatedStats);
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

    async setDone(categoryId: string, done: boolean): Promise<void> {
        try {
            const docRef = doc(this.userCollectionRef, this.authService.auth.currentUser.uid);
           // const docRef = doc(this.firestore, `users/${this.authService.auth.currentUser.uid}`);
            const statsRef = collection(docRef, 'stats');

            // Füge das Dokument für die Kategorie in der Subcollection stats hinzu oder aktualisiere es
            await setDoc(doc(statsRef, categoryId), { done }, { merge: true });
        } catch (error) {
            console.error('Error setting category done status:', error);
            throw error;
        }
    }

    async isDone(categoryId: string): Promise<boolean> {
        try {
            const docRef = doc(this.userCollectionRef, this.authService.auth.currentUser.uid);
            const statsRef = doc(docRef, `stats/${categoryId}`);
            const docSnap = await getDoc(statsRef);

            if (docSnap.exists()) {
                const statsData = docSnap.data();
                console.log('Kategorie ist abgeschlossen:', statsData['done']);
                return statsData['done'] || false;

            }
            return false;
        } catch (error) {
            console.error('Fehler beim Abrufen des Dokuments:', error);
            throw error;
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

        /*
        this.subscription = onSnapshot(refWithConverter, (snapshot) => {
            snapshot.docs.forEach(docData => {
                console.log(docData.data());
            });
        });
    */
        const statsDocs = await getDocs(refWithConverter);
        statsDocs.forEach((doc) => {
            const stats = doc.data();
            totalCorrectAnswers += stats.correctAnswers || 0;
            totalIncorrectAnswers += stats.incorrectAnswers || 0;
            completedQuizzes += stats.completedQuizzes || 0;
        });

        console.log("Ausgabe:", totalCorrectAnswers, totalIncorrectAnswers);
        return {
            totalCorrectAnswers,
            totalIncorrectAnswers,
            completedQuizzes
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription();
            this.subscription = null;
        }
    }

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







