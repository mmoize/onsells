import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FleekPageRoutingModule } from './fleek-routing.module';

import { FleekPage } from './fleek.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FleekPageRoutingModule
  ],
  declarations: [FleekPage]
})
export class FleekPageModule {}
