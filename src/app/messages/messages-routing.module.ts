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
  },
  {
    path: 'create-message',
    loadChildren: () => import('./create-message/create-message.module').then( m => m.CreateMessagePageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'usermessages',
    loadChildren: () => import('./usermessages/usermessages.module').then( m => m.UsermessagesPageModule)
  },
  {
    path: 'followers',
    loadChildren: () => import('./followers/followers.module').then( m => m.FollowersPageModule)
  },
  {
    path: 'groups',
    loadChildren: () => import('./groups/groups.module').then( m => m.GroupsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessagesPageRoutingModule {}

