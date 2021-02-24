import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardPage } from './board.page';

const routes: Routes = [
  {
    path: '',
    component: BoardPage,
    children: [
      {
        path: 'discover',
        loadChildren: () => import('./discover/discover.module').then( m => m.DiscoverPageModule)

      },
      {
        path: 'offers',
        loadChildren: () => import('./offers/offers.module').then( m => m.OffersPageModule)
      },

      {
         path: 'messages',
         loadChildren: () => import('../messages/messages.module').then( m => m.MessagesPageModule)
      }

    ],
  },

];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardPageRoutingModule {}
