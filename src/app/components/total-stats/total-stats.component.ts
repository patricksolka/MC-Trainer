import {Component, OnInit} from '@angular/core';
import {TotalStatsService} from '../../services/total-stats.service';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from "@angular/common";
import {Router} from '@angular/router';
import {AlertController} from "@ionic/angular/standalone";
import {onAuthStateChanged} from "@angular/fire/auth";

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
                private alertController: AlertController) {
        this.totalStatsService.initializeStats().then(() => {
            this.updateTotalStats();
        });
    }

    ngOnInit() {
        this.updateTotalStats();
    }

    updateTotalStats() {
        this.totalCorrectAnswers = this.totalStatsService.getTotalCorrectAnswers();
        this.totalIncorrectAnswers = this.totalStatsService.getTotalIncorrectAnswers();
    }

    backToHome() {
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

    ionViewWillEnter() {
        this.updateTotalStats();
    }
}
