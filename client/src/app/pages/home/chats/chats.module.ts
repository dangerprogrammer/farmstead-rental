import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatsPageRoutingModule } from './chats-routing.module';

import { ChatsPage } from './chats.page';
import { ModalModule } from "src/app/components/modals/modal.module";
import { HomeHeaderModule } from 'src/app/components/home-header/home-header.module';
import { ChatMessageComponent } from 'src/app/components/chat-message/chat-message.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatsPageRoutingModule,
    ModalModule,
    HomeHeaderModule
],
  declarations: [ChatsPage, ChatMessageComponent]
})
export class ChatsPageModule {}
