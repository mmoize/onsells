import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DesktopHomePageRoutingModule } from './desktop-home-routing.module';

import { DesktopHomePage } from './desktop-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DesktopHomePageRoutingModule
  ],
  declarations: []
})
export class DesktopHomePageModule {}
