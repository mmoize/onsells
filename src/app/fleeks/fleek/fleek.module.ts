import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FleekPageRoutingModule } from './fleek-routing.module';

import { FleekPage } from './fleek.page';

import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FleekPageRoutingModule,
    NgxIonicImageViewerModule,
    
  ],
  declarations: [FleekPage]
})
export class FleekPageModule {}
