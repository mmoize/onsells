import { ProductDetailPage } from './product-detail/product-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainFilterComponent } from '../../shared/filters/main-filter/main-filter.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LazyLoadImageModule } from 'ng-lazyload-image'; 
import {TimeAgoPipe} from 'time-ago-pipe';

import { DiscoverPageRoutingModule } from './discover-routing.module';

import { DiscoverPage } from './discover.page';
import { MapFilterModalComponent } from 'src/app/shared/filters/map-filter-modal/map-filter-modal.component';
import { ProductDetailPageModule } from './product-detail/product-detail.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LazyLoadImageModule,
    ReactiveFormsModule,
    DiscoverPageRoutingModule,
  ],
  declarations: [DiscoverPage, ],
})
export class DiscoverPageModule {}
