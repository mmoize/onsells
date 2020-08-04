import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateMessagePage } from './create-message.page';

const routes: Routes = [
  {
    path: '',
    component: CreateMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateMessagePageRoutingModule {}
