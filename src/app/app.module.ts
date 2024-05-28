// AppModule
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CardModule } from './card/card.module'; // Importiere das CardModule

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    CardModule // Importiere das CardModule hier
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
