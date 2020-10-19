import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ChatPageRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  declarations: [ChatPage]
})
export class ChatPageModule {}
