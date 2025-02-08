import { Component, Input } from '@angular/core';
import { Message, PendingMessage, PrivateChat, PublicChat, User } from 'src/app/types';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent {
  @Input() self!: User;
  @Input() message!: Message | PendingMessage;
  @Input() chat!: PrivateChat | PublicChat;

  isMessage(message: any): message is Message {
    return 'id' in message;
  }
}