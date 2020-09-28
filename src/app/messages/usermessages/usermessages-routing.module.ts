import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsermessagesPage } from './usermessages.page';

const routes: Routes = [
  {
    path: '',
    component: UsermessagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsermessagesPageRoutingModule {}
