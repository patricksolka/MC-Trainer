import {Component} from '@angular/core';
import {Auth} from "@angular/fire/auth";
import {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonRadio,
    IonRow, IonSkeletonText,
    IonText,
    IonToolbar
} from "@ionic/angular/standalone";
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CardService} from "../../services/card.service";


@Component({
    selector: 'app-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, IonButton, IonContent, IonIcon, IonText, IonImg, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonList, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonToolbar, IonButtons, IonHeader, IonLabel, IonRadio, IonCardTitle, IonSkeletonText]
})
export class ProgressBarComponent {
    public loaded: boolean = false;

    //Progress
    public learnedMinutes: number = 0;
    public totalMinutes: number = 10;
    public progress: number
    public hasLearningSessions: boolean = false;

    constructor(
        private auth: Auth,
        private cardService: CardService,
    ) {}

    async fetchProgress() {
        this.loaded = false;
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            console.log('Current user:', currentUser);
           /* this.cardService.getLearningSession(currentUser.uid).subscribe(learningSessions => {
                this.learnedMinutes = Math.round(learningSessions.reduce((total, session) =>
                    total + session['duration'], 0));
                this.progress = this.calcPercentage();
                console.log('learnedMinutes', this.learnedMinutes);
                console.log('progress', this.progress);
                this.loaded = true;
            });*/
            this.cardService.getLearningSession(currentUser.uid).subscribe(learningSessions => {
                if (learningSessions && learningSessions.length > 0) {
                    // Calculate learning duration
                    const totalDuration = learningSessions.reduce((total, session) => total + session['duration'], 0);
                    this.learnedMinutes = Math.round(totalDuration);

                    // Ensure progress is at least 1 minute if there's any learning session
                    this.progress = this.learnedMinutes < 1 ? 1 : this.learnedMinutes;
                } else {
                    this.learnedMinutes = 0;
                    this.progress = 0;
                }
                console.log('learnedMinutes', this.learnedMinutes);
                console.log('progress', this.progress);
                this.loaded = true;
            });




        }
    }
    calcPercentage() {
        const displayedMinutes = Math.max(this.learnedMinutes, 1);
        const progressPercentage = (displayedMinutes / this.totalMinutes) * 100;
        return Math.min(progressPercentage, 100);
    }

    protected readonly Math = Math;
}
