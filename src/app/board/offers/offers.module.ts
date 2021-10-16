import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OffersPageRoutingModule } from './offers-routing.module';

import { OffersPage } from './offers.page';
import { OfferProductPage } from './offer-product/offer-product.page';
import { ProductOfferComponent } from './product-offer/product-offer.component';
import { NewPostPipe } from './new-post.pipe';
import { ItemsPage } from './items/items.page';
import { CurrentListingsPage } from './current-listings/current-listings.page';
import { ItemsPageModule } from './items/items.module';
import { CurrentListingsPageModule } from './current-listings/current-listings.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    OffersPageRoutingModule,
    SharedModule,
    ItemsPageModule,
    CurrentListingsPageModule
  ],
  declarations: [
                 OfferProductPage,
                 ProductOfferComponent, 
                 NewPostPipe, 
                 OffersPage
                 ],
  exports: []
})
export class OffersPageModule {}
