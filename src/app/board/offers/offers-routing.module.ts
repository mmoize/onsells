import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffersPage } from './offers.page'; 

const routes: Routes = [
  {
    path: '',
    component: OffersPage
  }, 
  {
    path: 'offer-product',
    loadChildren: () => import('./offer-product/offer-product.module').then( m => m.OfferProductPageModule)
  },
  {
    path: 'new-product',
    loadChildren: () => import('./new-product/new-product.module').then( m => m.NewProductPageModule)
  },
  {
    path: 'edit-product',
    loadChildren: () => import('./edit-product/edit-product.module').then( m => m.EditProductPageModule)
  },
  {
    path: 'new-post',
    loadChildren: () => import('./new-post/new-post.module').then( m => m.NewPostPageModule)
  },
  {
    path: 'current-listings',
    loadChildren: () => import('./current-listings/current-listings.module').then( m => m.CurrentListingsPageModule)
  },
  {
    path: 'items',
    loadChildren: () => import('./items/items.module').then( m => m.ItemsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffersPageRoutingModule {}
