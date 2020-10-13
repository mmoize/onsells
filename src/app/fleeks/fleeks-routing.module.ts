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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FleeksPageRoutingModule {}
