import { MessagesPage } from './../messages.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
// import {TimeAgoPipe} from 'time-ago-pipe';

import { UsermessagesPageRoutingModule } from './usermessages-routing.module';

import { UsermessagesPage } from './usermessages.page';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MomentModule,
    UsermessagesPageRoutingModule
  ],
  providers: [
    VideoPlayer],

  declarations: []
})
export class UsermessagesPageModule {}
