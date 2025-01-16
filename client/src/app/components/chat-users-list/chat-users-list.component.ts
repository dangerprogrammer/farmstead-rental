import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PrivateChat, PublicChat } from 'src/app/types';

@Component({
  selector: 'app-chat-users-list',
  templateUrl: './chat-users-list.component.html',
  styleUrls: ['./chat-users-list.component.scss']
})
export class ChatUsersListComponent {
  @Input() privateChats?: PrivateChat[];
  @Input() publicChats?: PublicChat[];
  
  @Input() sub!: string;

  constructor(
    private router: Router
  ) {}

  getChat({ privateChat, publicChat }: { privateChat?: PrivateChat, publicChat?: PublicChat }) {
    this.router.navigate(['/', 'home', 'chats', (privateChat || publicChat)!.id]);
  }
}