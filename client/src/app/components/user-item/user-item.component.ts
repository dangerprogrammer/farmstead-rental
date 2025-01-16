import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { PrivateChat, PublicChat } from 'src/app/types';
import { Message } from 'src/app/types/message.type';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent implements OnInit {
  @Input() privateChat?: PrivateChat;
  @Input() publicChat?: PublicChat;

  @Input() sub!: string;

  @Input() details: boolean = !0;

  message?: Message;

  @Output() clickEmitter = new EventEmitter();

  constructor(
    @Inject('SEARCH_SERVICE') private search: SearchService,
  ) { }

  ngOnInit(): void {
    if (this.privateChat) this.search.lastMessageChat(this.privateChat.id).subscribe(lastMessage => {
      if (lastMessage) {
        this.message = lastMessage;

        console.log('message', lastMessage);
      };
    });
  }

  sendClick() {
    this.clickEmitter.emit();
  }
}
