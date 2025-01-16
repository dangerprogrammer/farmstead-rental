import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { ModalModule } from 'src/app/components/modals/modal.module';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import { ChatUsersListComponent } from 'src/app/components/chat-users-list/chat-users-list.component';
import { UserItemComponent } from 'src/app/components/user-item/user-item.component';
import { HomeHeaderModule } from 'src/app/components/home-header/home-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ModalModule,
    HomeHeaderModule
  ],
  declarations: [HomePage, UserListComponent, ChatUsersListComponent, UserItemComponent]
})
export class HomePageModule {}
