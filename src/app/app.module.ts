
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

import { CommonModule } from '@angular/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';



import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { VideoPlayer } from '@ionic-native/video-player/ngx';

import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/File/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { MomentModule } from 'ngx-moment';
import { environment } from '../environments/environment.prod';



import { provideFirebaseApp, initializeApp } 
from '@angular/fire/app';
import { getAuth, provideAuth } 
from '@angular/fire/auth';
import { getFirestore, provideFirestore } 
from '@angular/fire/firestore';
import { getDatabase, provideDatabase } 
from '@angular/fire/database';
import { getStorage, provideStorage } 
from '@angular/fire/storage';
import { getAnalytics, provideAnalytics } 
from '@angular/fire/analytics';




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  // tslint:disable-next-line: max-line-length
  imports: [
            BrowserModule,
            MomentModule,
            HttpClientModule,
            IonicModule.forRoot(),
            AppRoutingModule,
            SuperTabsModule.forRoot(),
            provideFirebaseApp(() => initializeApp(environment.firebase)),
            provideFirestore(() => getFirestore()),
            provideDatabase(() => getDatabase()),
            provideAuth(() => getAuth()),
            provideStorage(() => getStorage()),
            provideAnalytics(() => getAnalytics()),
            ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
            ServiceWorkerModule.register('ngsw-worker.js'),
            LazyLoadImageModule, 



          ],
  providers: [
    StatusBar,
    SplashScreen,
    VideoPlayer,
    ImagePicker,
    MediaCapture,
    Media,
    StreamingMedia,
    PhotoViewer,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
