import { Component, Input } from '@angular/core';
import { Message, User } from 'src/app/types';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent {
  @Input() self!: User;
  @Input() message!: Message;
}