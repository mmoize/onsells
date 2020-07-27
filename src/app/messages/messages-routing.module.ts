import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessagesPage } from './messages.page';

const routes: Routes = [
  {
    path: '',
    component: MessagesPage,
    
    // children: [
    //   {
    //     path: 'message-detail',
    //     loadChildren: () => import('./message-detail/message-detail.module').then( m => m.MessageDetailPageModule)
    //   }
    // ]
  },
  {
    path: 'message-detail',
    loadChildren: () => import('./message-detail/message-detail.module').then( m => m.MessageDetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessagesPageRoutingModule {}

