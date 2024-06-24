import { Component, OnInit } from '@angular/core';
import { TotalStatsService } from '../../services/total-stats.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from "@angular/common";
import { Router } from '@angular/router';
import {AlertController} from "@ionic/angular/standalone";

@Component({
    selector: 'app-total-stats',
    templateUrl: './total-stats.component.html',
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class TotalStatsComponent implements OnInit {
    totalCorrectAnswers: number = 0;
    totalIncorrectAnswers: number = 0;

    constructor(private totalStatsService: TotalStatsService, private router: Router,
                private alertController: AlertController) {}

    ngOnInit() {
        this.updateTotalStats();
    }

    updateTotalStats() {
        this.totalCorrectAnswers = this.totalStatsService.getTotalCorrectAnswers();
        this.totalIncorrectAnswers = this.totalStatsService.getTotalIncorrectAnswers();
    }
    /*
        resetTotalStats() {
            this.totalStatsService.resetStats();
            this.totalCorrectAnswers = 0;
            this.totalIncorrectAnswers = 0;
        }

     */

    backToHome(){
        this.router.navigate(['/home']);
    }

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
                        this.updateTotalStats();
                    }
                }
            ]
        });

        await alert.present();
    }
}
