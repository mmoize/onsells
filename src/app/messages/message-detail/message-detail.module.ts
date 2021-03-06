import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessageDetailPageRoutingModule } from './message-detail-routing.module';

import { MessageDetailPage } from './message-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MessageDetailPageRoutingModule
  ],
  declarations: [MessageDetailPage]
})
export class MessageDetailPageModule {}
