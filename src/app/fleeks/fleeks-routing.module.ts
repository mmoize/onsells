import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FleeksPage } from './fleeks.page';

const routes: Routes = [
  {
    path: '',
    component: FleeksPage
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'fleekscamera',
    loadChildren: () => import('./fleekscamera/fleekscamera.module').then( m => m.FleekscameraPageModule)
  },
  {
    path: 'fleek',
    loadChildren: () => import('./fleek/fleek.module').then( m => m.FleekPageModule)
  },
  {
    path: 'video',
    loadChildren: () => import('./video/video.module').then( m => m.VideoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FleeksPageRoutingModule {}
