import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { loginGuard } from 'src/app/guards/login.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    canActivate: [loginGuard]
  },
  {
    path: 'chats/:id',
    loadChildren: () => import('./chats/chats.module').then( m => m.ChatsPageModule)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
