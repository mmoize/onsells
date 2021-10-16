import { UsermessagesPage } from './usermessages/usermessages.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessagesPageRoutingModule } from './messages-routing.module';


import { MessagesPage } from './messages.page';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { UsermessagesPageModule } from './usermessages/usermessages.module';
import { ChatPage } from './chat/chat.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperTabsModule.forRoot(),
    MessagesPageRoutingModule,
  ],
  declarations: [ChatPage, MessagesPage, UsermessagesPage]
})
export class MessagesPageModule {}
