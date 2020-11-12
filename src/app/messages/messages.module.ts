import { UsermessagesPage } from './usermessages/usermessages.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessagesPageRoutingModule } from './messages-routing.module';
import {TimeAgoPipe} from 'time-ago-pipe';

import { MessagesPage } from './messages.page';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { UsermessagesPageModule } from './usermessages/usermessages.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperTabsModule.forRoot(),
    MessagesPageRoutingModule,
  ],
  declarations: [MessagesPage, UsermessagesPage, TimeAgoPipe]
})
export class MessagesPageModule {}
