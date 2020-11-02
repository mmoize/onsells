import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailPageRoutingModule } from './product-detail-routing.module';

import { ProductDetailPage } from './product-detail.page';
import {TimeAgoPipe} from 'time-ago-pipe';

import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { ChatPageModule } from 'src/app/messages/chat/chat.module';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailPageRoutingModule,
    SharedModule,
    NgxIonicImageViewerModule,
    ChatPageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  declarations: [ProductDetailPage, TimeAgoPipe]
})
export class ProductDetailPageModule {}
