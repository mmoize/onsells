import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IosHomePage } from './ios-home.page';

const routes: Routes = [
  {
    path: '',
    component: IosHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IosHomePageRoutingModule {}
