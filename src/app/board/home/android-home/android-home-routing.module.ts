import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AndroidHomePage } from './android-home.page';

const routes: Routes = [
  {
    path: '',
    component: AndroidHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AndroidHomePageRoutingModule {}
