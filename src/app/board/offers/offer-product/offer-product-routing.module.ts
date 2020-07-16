import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfferProductPage } from './offer-product.page';

const routes: Routes = [
  {
    path: '',
    component: OfferProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfferProductPageRoutingModule {}
