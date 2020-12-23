import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FleekPageRoutingModule } from './fleek-routing.module';

import { FleekPage } from './fleek.page';

import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FleekPageRoutingModule,
    LazyLoadImageModule,
    NgxIonicImageViewerModule,
    
  ],
  declarations: [FleekPage]
})
export class FleekPageModule {}
