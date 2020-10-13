import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FleeksPageRoutingModule } from './fleeks-routing.module';

import { FleeksPage } from './fleeks.page';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { HomePageModule } from './home/home.module';
import { FleekscameraPageModule } from './fleekscamera/fleekscamera.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FleeksPageRoutingModule,
    HomePageModule,
    FleekscameraPageModule,
    SuperTabsModule.forRoot(),
  ],
  declarations: [FleeksPage]
})
export class FleeksPageModule {}