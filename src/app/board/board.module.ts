import { FleekscameraPageModule } from './../fleeks/fleekscamera/fleekscamera.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {  VideoPlayer } from '@ionic-native/video-player/ngx';
import { BoardPageRoutingModule } from './board-routing.module';

import { BoardPage } from './board.page';
import { CategoryPickerComponent } from '../shared/pickers/category-picker/category-picker.component';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { OffersPageModule } from './offers/offers.module';
import { DiscoverPageModule } from './discover/discover.module';
import { ProductDetailPageModule } from './discover/product-detail/product-detail.module';
import { HomePageModule } from './home/home.module';
import { MessagesPageModule } from '../messages/messages.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscoverPageModule,
    //OffersPageModule,
    MessagesPageModule,
    FleekscameraPageModule,
    BoardPageRoutingModule,
  ],
  providers: [VideoPlayer ],
  declarations: [BoardPage]
})
export class BoardPageModule {}
