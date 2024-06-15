import {enableProdMode, importProvidersFrom} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {RouteReuseStrategy, provideRouter} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import { HttpClientModule } from "@angular/common/http";
import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {environment} from './environments/environment';
import { register as registerSwiperElements} from  'swiper/element/bundle';
//Firebase
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {IonicModule} from "@ionic/angular";

// Swiper Init
registerSwiperElements();


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        importProvidersFrom(IonicModule.forRoot({innerHTMLTemplatesEnabled: true})),
        provideIonicAngular({innerHTMLTemplatesEnabled: true}),
        provideRouter(routes),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth())
    ],
});
