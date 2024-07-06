import { Component, OnInit } from '@angular/core';
import { TotalStatsService } from '../../services/total-stats.service';
import { CommonModule } from "@angular/common";
import { Router } from '@angular/router';
import {
    AlertController, IonButton,
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent, IonProgressBar
} from "@ionic/angular/standalone";
import {AuthService} from "../../services/auth.service";
import {CategoryService} from "../../services/category.service";
import {Category} from "../../models/categories.model";

@Component({
    selector: 'app-total-stats',
    templateUrl: './total-stats.component.html',
    standalone: true,
    imports: [CommonModule, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonProgressBar]
})
export class TotalStatsComponent implements OnInit {
    categories: Category[] = [];
    totalCorrectAnswers: number
    totalIncorrectAnswers: number
    completedQuizzes: number = 0;
    percentageCorrectAnswers: number = 0;
    modules: any[] = [];

    constructor(private totalStatsService: TotalStatsService, private router: Router,
                private alertController: AlertController, private authService: AuthService, private categoryService: CategoryService) {
    }

    ngOnInit() {
            this.loadStats();
    }
    /*
    async loadStats(){
        this.totalStatsService.calculateTotalStats(this.authService.auth.currentUser.uid)
            .then(stats => {
                this.totalCorrectAnswers = stats.totalCorrectAnswers;
                this.totalIncorrectAnswers = stats.totalIncorrectAnswers;
                this.completedQuizzes = stats.completedQuizzes;
            });
    }
*/
    async loadStats() {
        const stats = await this.totalStatsService.calculateTotalStats(this.authService.auth.currentUser.uid);
        this.totalCorrectAnswers = stats.totalCorrectAnswers;
        this.totalIncorrectAnswers = stats.totalIncorrectAnswers;
        this.completedQuizzes = stats.completedQuizzes;
        this.percentageCorrectAnswers = (this.totalCorrectAnswers / (this.totalCorrectAnswers + this.totalIncorrectAnswers)) * 100;

        // this.modules = await this.totalStatsService.getModuleStats(this.authService.auth.currentUser.uid);
    }

    backToHome() {
        this.router.navigate(['/home']);
    }

    //TODO: Will man seine Statistik überhaupt zurücksetzen können?
    async resetTotalStats() {
        const alert = await this.alertController.create({
            header: 'Statistik zurücksetzen',
            message: 'Möchten Sie wirklich alle gespeicherten Statistiken zurücksetzen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Ja',
                    handler: () => {
                        this.totalStatsService.resetStats();
                        //this.updateTotalStats();
                    }
                }
            ]
        });

        await alert.present();
    }

    ionViewWillEnter() {
       this.loadStats();
    }
}
