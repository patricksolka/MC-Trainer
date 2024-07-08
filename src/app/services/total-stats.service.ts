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

/**
 * @class TotalStatsService
 * @description Dieser Service verwaltet die Gesamtstatistiken der Benutzerquizze.
 */
@Injectable({
    providedIn: 'root'
})
export class TotalStatsService {
    private totalCorrectAnswers: number = 0;
    private totalIncorrectAnswers: number = 0;
    private subscription: Unsubscribe | null = null;
    private userCollection: CollectionReference<DocumentData>;

    /**
     * @constructor
     * @param {Firestore} firestore - Firebase Firestore-Instanz.
     * @param {UserService} userService - Service für Benutzeroperationen.
     * @param {AuthService} authService - Service für Authentifizierungsoperationen.
     *
     */
    constructor(private firestore: Firestore, private userService: UserService, private authService: AuthService) {
        this.userCollection = collection(firestore, 'users') as CollectionReference<DocumentData>;
    }

    /**
     * @method updateStats
     * @description Aktualisiert die Gesamtstatistiken.
     * @param {number} correct - Anzahl der richtigen Antworten.
     * @param {number} incorrect - Anzahl der falschen Antworten.
     */
    updateStats(correct: number, incorrect: number) {
        this.totalCorrectAnswers += correct;
        this.totalIncorrectAnswers += incorrect;
        console.log(this.authService.auth.currentUser.uid);
    }

    /**
     * @method persistStats
     * @description Speichert die Statistiken eines Benutzers in Firestore.
     * @param {string} uid - Die Benutzer-ID.
     * @param {string} categoryId - Die Kategorie-ID.
     * @param {Stats} stats - Die zu speichernden Statistiken.
     */
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

    /**
     * @method getStats
     * @description Holt die Statistiken eines Benutzers für eine bestimmte Kategorie aus Firestore.
     * @param {string} uid - Die Benutzer-ID.
     * @param {string} categoryId - Die Kategorie-ID.
     * @returns {Promise<Stats | null>} - Die Statistiken oder null, wenn keine vorhanden sind.
     */
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

    /**
     * @method getStatsById
     * @description Holt die Statistiken eines Benutzers für eine bestimmte Kategorie anhand der ID aus Firestore.
     * @param {string} uid - Die Benutzer-ID.
     * @param {string} categoryId - Die Kategorie-ID.
     * @returns {Promise<Stats | null>} - Die Statistiken oder null, wenn keine vorhanden sind.
     */
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

    /**
     * @method calculateTotalStats
     * @description Berechnet die Gesamtstatistiken eines Benutzers.
     * @param {string} uid - Die Benutzer-ID.
     * @returns {Promise<Object>} - Ein Objekt mit den Gesamtstatistiken.
     */
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

    /**
     * @method resetStats
     * @description Setzt die Gesamtstatistiken zurück.
     */
    resetStats() {
        this.totalCorrectAnswers = 0;
        this.totalIncorrectAnswers = 0;
        //this.updatedateFirebaseStats(this.authService.auth.currentUser.uid, "correctAnswers", 0);
        //this.updatedateFirebaseStats(this.authService.auth.currentUser.uid,
        // "incorrectAnswers", 0);
    }
}







