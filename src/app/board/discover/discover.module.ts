import { MainFilterComponent } from './../../shared/filters/main-filter/main-filter.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscoverPageRoutingModule } from './discover-routing.module';

import { DiscoverPage } from './discover.page';
import { MapFilterModalComponent } from 'src/app/shared/filters/map-filter-modal/map-filter-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    DiscoverPageRoutingModule
  ],
  declarations: [DiscoverPage, MapFilterModalComponent, MainFilterComponent]
})
export class DiscoverPageModule {}
