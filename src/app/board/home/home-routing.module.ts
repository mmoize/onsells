import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'android-home',
    loadChildren: () => import('./android-home/android-home.module').then( m => m.AndroidHomePageModule)
  },
  {
    path: 'ios-home',
    loadChildren: () => import('./ios-home/ios-home.module').then( m => m.IosHomePageModule)
  },
  {
    path: 'desktop-home',
    loadChildren: () => import('./desktop-home/desktop-home.module').then( m => m.DesktopHomePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
