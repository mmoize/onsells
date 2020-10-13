import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FleekscameraPageRoutingModule } from './fleekscamera-routing.module';

import { FleekscameraPage } from './fleekscamera.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FleekscameraPageRoutingModule
  ],
  declarations: [FleekscameraPage]
})
export class FleekscameraPageModule {}
