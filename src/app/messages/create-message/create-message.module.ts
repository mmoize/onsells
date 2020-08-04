import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateMessagePageRoutingModule } from './create-message-routing.module';

import { CreateMessagePage } from './create-message.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateMessagePageRoutingModule
  ],
  declarations: [CreateMessagePage]
})
export class CreateMessagePageModule {}
