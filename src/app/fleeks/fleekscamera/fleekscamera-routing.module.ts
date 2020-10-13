import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FleekscameraPage } from './fleekscamera.page';

const routes: Routes = [
  {
    path: '',
    component: FleekscameraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FleekscameraPageRoutingModule {}
