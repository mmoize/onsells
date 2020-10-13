import { MessagesPage } from './../messages.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsermessagesPageRoutingModule } from './usermessages-routing.module';

import { UsermessagesPage } from './usermessages.page';
import { VideoPlayer } from '@ionic-native/video-player/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsermessagesPageRoutingModule
  ],
  providers: [
    VideoPlayer],

  declarations: [UsermessagesPage]
})
export class UsermessagesPageModule {}
