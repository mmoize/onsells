import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurrentListingsPageRoutingModule } from './current-listings-routing.module';

import { CurrentListingsPage } from './current-listings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrentListingsPageRoutingModule
  ],
  declarations: [CurrentListingsPage],
  exports: [CurrentListingsPage]
})
export class CurrentListingsPageModule {}
