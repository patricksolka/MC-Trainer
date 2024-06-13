import {enableProdMode, importProvidersFrom} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { HttpClientModule } from "@angular/common/http";
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
// Swiper Init
import { register as registerSwiperElements} from  'swiper/element/bundle';

registerSwiperElements();

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [ HttpClientModule,
    importProvidersFrom(HttpClientModule), // Hier HttpClientModule importieren

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({innerHTMLTemplatesEnabled:true}),
    provideRouter(routes),
  ],
});
