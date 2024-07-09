/**
 * @fileoverview Diese Datei enthält den TotalStatsService, der die Gesamtstatistiken der Benutzerquizze verwaltet.
 */
import {Injectable} from '@angular/core';
import {
    collection,
    CollectionReference,
    doc,
    DocumentData,
    Firestore,
    getDoc, getDocs,
    QueryDocumentSnapshot,
    setDoc,
    SnapshotOptions, Unsubscribe,
    updateDoc
} from '@angular/fire/firestore';
import {UserService} from "./user.service";
import {AuthService} from "./auth.service";
import {Stats} from "../models/stats.model";
import {AchievementService} from "./achievement.service";
import {ToastController} from "@ionic/angular/standalone";

/**
 * @class TotalStatsService
 * @description Dieser Service verwaltet die Gesamtstatistiken der Benutzerquizze.
 */
@Injectable({
    providedIn: 'root'
})
export class TotalStatsService {
    private subscription: Unsubscribe | null = null;
    userCollectionRef: CollectionReference<DocumentData>;
    /**
     * @constructor
     * @param {Firestore} firestore - Firebase Firestore-Instanz.
     * @param {UserService} userService - Service für Benutzeroperationen.
     * @param {AuthService} authService - Service für Authentifizierungsoperationen.
     * @param {AchievementService} authService - Service für AchievementService.
     * @param {ToastController} authService - Service für ToastController.
     * @param achievementService
     * @param toastController
     */
    constructor(
        private firestore: Firestore,
        private userService: UserService,
        private authService: AuthService,
        private achievementService: AchievementService,
        private toastController: ToastController
    ) {
        this.userCollectionRef = collection(firestore, 'users') as CollectionReference<DocumentData>;
    }

    checkForNewAchievements(stats) {
        const newAchievements = this.achievementService.checkAchievements(stats);
        this.showAchievementToast(newAchievements);
    }

    async showAchievementToast(achievements) {
        const toasts = [];
        for(const achievement of achievements) {
            const toast = await this.toastController.create({
                header: 'Herzlichen Glückwunsch!',
                message: `${achievement.name}: ${achievement.description}`,
                duration: 2000,
                position: 'top',
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
    /**
     * @method persistStats
     * @description Speichert die Statistiken eines Benutzers in Firestore.
     * @param {string} uid - Die Benutzer-ID.
     * @param {string} categoryId - Die Kategorie-ID.
     * @param {Stats} stats - Die zu speichernden Statistiken.
     */
    async persistStats(uid: string, categoryId: string, stats: Stats) {
        const statsCollectionRef = doc(this.userCollectionRef, uid, 'stats', categoryId);
        try {
            const docSnap = await getDoc(statsCollectionRef);

            if (docSnap.exists()) {
                const currentStats = docSnap.data() as Stats;
                const updatedStats = {
                    correctAnswers: currentStats.correctAnswers + stats.correctAnswers,
                    incorrectAnswers: currentStats.incorrectAnswers + stats.incorrectAnswers,
                    completedQuizzes: currentStats.completedQuizzes + stats.completedQuizzes,
                    completedCards: currentStats.completedCards + stats.completedCards
                };
                await updateDoc(statsCollectionRef, updatedStats);
            } else {
                const statsData: DocumentData = {
                    ...this.statsConverter.toFirestore(stats),
                    completedQuizzes: 1,
                    completedCards: stats.completedCards
                };
                await setDoc(statsCollectionRef, statsData);
            }
            const newStats = await this.calcTotalStats(this.authService.auth.currentUser.uid);
            const updatedStats = {
                correctAnswers: newStats.totalCorrectAnswers,
                incorrectAnswers: newStats.totalIncorrectAnswers,
                completedQuizzes: newStats.completedQuizzes,
                completedCards: newStats.completedQuizzes
            };
            this.checkForNewAchievements(updatedStats);
        } catch (e) {
            console.error("Error persisting stats:", e);
        }
    }
    /**
     * @method getStats
     * @description Holt die Statistiken eines Benutzers für eine bestimmte Kategorie aus Firestore.
     * @param {string} uid - Die Benutzer-ID.
     * @param {string} categoryId - Die Kategorie-ID.
     * @returns {Promise<Stats | null>} - Die Statistiken oder null, wenn keine vorhanden sind.
     */
    async getStats(uid: string, categoryId: string) {
        const statsCollectionRef = doc(this.firestore, `users/${uid}/stats/${categoryId}`);
        const refWithConverter = statsCollectionRef.withConverter(this.statsConverter);
        const docSnap = await getDoc(refWithConverter);

        if (docSnap.exists()) {
            const result = docSnap.data() as Stats;
            console.log("Retrieved stats for id:", result);
            return result;
        } else {
            console.log("No stats found for id:", categoryId);
            return null;
        }
    }

    /**
     * @method getStatsById
     * @description Holt die Statistiken eines Benutzers für eine bestimmte Kategorie anhand der ID aus Firestore.
     * @param {string} uid - Die Benutzer-ID.
     * @param {string} categoryId - Die Kategorie-ID.
     * @returns {Promise<Stats | null>} - Die Statistiken oder null, wenn keine vorhanden sind.
     */
    async getStatsById(uid: string, categoryId: string) {
        const statsCollectionRef = doc(this.firestore, `users/${uid}/stats/${categoryId}`);
        const refWithConverter = statsCollectionRef.withConverter(this.statsConverter);
        const docSnap = await getDoc(refWithConverter);

        if (docSnap.exists()) {
            const result = docSnap.data() as Stats;
            console.log("Retrieved stats for id:", result);
            return result;
        } else {
            console.log("No stats found for id bdbdb:"); // Hinzugefügte Protokollierung
            return null;
        }
    }

    //Set category to done
    async setDone(categoryId: string, done: boolean): Promise<void> {
        try {
            const docRef = doc(this.userCollectionRef, this.authService.auth.currentUser.uid);
            const statsRef = collection(docRef, 'stats');

            await setDoc(doc(statsRef, categoryId), { done }, { merge: true });
        } catch (error) {
            console.error('Error setting category done status:', error);
            throw error;
        }
    }
    //Check if isDone
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

    /**
     * @method calculateTotalStats
     * @description Berechnet die Gesamtstatistiken eines Benutzers.
     * @param {string} uid - Die Benutzer-ID.
     * @returns {Promise<Object>} - Ein Objekt mit den Gesamtstatistiken.
     */
    async calcTotalStats(uid: string) {
        const statsCollectionRef = collection(this.firestore, `users/${uid}/stats/`);
        const refWithConverter = statsCollectionRef.withConverter(this.statsConverter);

        let totalCorrectAnswers = 0;
        let totalIncorrectAnswers = 0;
        let completedQuizzes = 0;
        let completedCards = 0;

        const statsDocs = await getDocs(refWithConverter);
        statsDocs.forEach((doc) => {
            const stats = doc.data();
            totalCorrectAnswers += stats.correctAnswers || 0;
            totalIncorrectAnswers += stats.incorrectAnswers || 0;
            completedQuizzes += stats.completedQuizzes || 0;
            completedCards += stats.completedCards || 0;
        });
        return {
            totalCorrectAnswers,
            totalIncorrectAnswers,
            completedQuizzes,
            completedCards
        };
    }

    /**
     * @method ngOnDestroy
     * @description Lebenszyklus-Hook, der bei der Zerstörung der Komponente aufgerufen wird und die Abonnements beendet.
     */
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
}







