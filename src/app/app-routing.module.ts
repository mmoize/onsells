import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'board/discover', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'accounts',
    loadChildren: () => import('./accounts/accounts.module').then( m => m.AccountsPageModule), canLoad: [AuthGuard]
  },
  {
    path: 'board',
    loadChildren: () => import('./board/board.module').then( m => m.BoardPageModule), canLoad: [AuthGuard]
  },
  {
    path: 'board/discover',
    loadChildren: () => import('./board/discover/discover.module').then( m => m.DiscoverPageModule), canLoad: [AuthGuard]
  },
  {
    path: 'messages',
    loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule), canLoad: [AuthGuard]
  },
  {
    path: 'fleeks',
    loadChildren: () => import('./fleeks/fleeks.module').then( m => m.FleeksPageModule), canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
