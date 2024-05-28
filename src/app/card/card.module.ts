import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {CommonModule, NgIf} from '@angular/common';
import { CardComponent } from './card.component';

@NgModule({
  declarations: [
    CardComponent
  ],
  imports: [
    NgIf,
    IonicModule,
    CommonModule // CommonModule für NgForOf-Direktive
  ],
  exports: [
    CardComponent
  ]
})
export class CardModule { }
