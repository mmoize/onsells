import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FleekPage } from './fleek.page';

const routes: Routes = [
  {
    path: '',
    component: FleekPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FleekPageRoutingModule {}
