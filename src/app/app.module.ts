import { AngularFireFunctions } from '@angular/fire/functions';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { SuperTabsModule } from '@ionic-super-tabs/angular';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  // tslint:disable-next-line: max-line-length
  imports: [BrowserModule,
            HttpClientModule,
            IonicModule.forRoot(),
            AppRoutingModule,
            SuperTabsModule.forRoot(),
            ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
            AngularFireModule.initializeApp(environment.firebaseConfig),
            AngularFireAuthModule,
            AngularFireDatabaseModule,
            AngularFireStorageModule
          ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
