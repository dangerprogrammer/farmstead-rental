import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
import { PrivateChat, PublicChat } from 'src/app/types';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage {
  privateChat?: PrivateChat;
  publicChat?: PublicChat;
  error: boolean = !1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject('SEARCH_SERVICE') private search: SearchService
  ) {
    this.getChat();
  }

  backHome() {
    this.router.navigate(['/', 'home']);
  }

  getChat() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.search.privateChat(id).subscribe({
      error: () => this.error = !0,
      next: privateChat => this.privateChat = privateChat,
      complete: () => {
        if (this.privateChat) console.log(this.privateChat);
      }
    });

    this.search.publicChat(id).subscribe({
      error: () => this.error = !0,
      next: publicChat => this.publicChat = publicChat,
      complete: () => {
        if (this.publicChat) console.log(this.publicChat);
      }
    });
  }
}
