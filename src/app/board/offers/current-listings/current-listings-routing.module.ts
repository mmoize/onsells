import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrentListingsPage } from './current-listings.page';

const routes: Routes = [
  {
    path: '',
    component: CurrentListingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrentListingsPageRoutingModule {}
