import { VideoPageModule } from './video/video.module';
import { VideoPage } from './video/video.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FleeksPageRoutingModule } from './fleeks-routing.module';

import { FleeksPage } from './fleeks.page';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { HomePageModule } from './home/home.module';
import { FleekscameraPageModule } from './fleekscamera/fleekscamera.module';
import { FleekPageModule } from './fleek/fleek.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FleeksPageRoutingModule,
    HomePageModule,
    FleekPageModule,
    FleekscameraPageModule,
    VideoPageModule,
    LazyLoadImageModule,
    SuperTabsModule.forRoot(),
  ],
  declarations: [FleeksPage]
})
export class FleeksPageModule {}
