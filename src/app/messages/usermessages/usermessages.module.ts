import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsermessagesPageRoutingModule } from './usermessages-routing.module';

import { UsermessagesPage } from './usermessages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsermessagesPageRoutingModule
  ],
  declarations: [UsermessagesPage]
})
export class UsermessagesPageModule {}
