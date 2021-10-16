import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AndroidHomePageRoutingModule } from './android-home-routing.module';

import { AndroidHomePage } from './android-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AndroidHomePageRoutingModule
  ],
  declarations: []
})
export class AndroidHomePageModule {}
