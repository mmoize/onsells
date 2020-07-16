import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfferProductPageRoutingModule } from './offer-product-routing.module';

import { OfferProductPage } from './offer-product.page';
import { OffersPage } from '../offers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfferProductPageRoutingModule
  ],
  declarations: [OfferProductPage,  OffersPage]
})
export class OfferProductPageModule {}
