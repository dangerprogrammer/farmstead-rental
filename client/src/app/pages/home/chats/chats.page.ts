import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
import { AuthPage, AuthSetup } from 'src/app/tools/auth.page';
import { PrivateChat, PublicChat } from 'src/app/types';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements AuthSetup {
  privateChat?: PrivateChat;
  publicChat?: PublicChat;
  error: boolean = !1;
  complete: boolean = !1;

  url: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject('SEARCH_SERVICE') private search: SearchService,
    private authPage: AuthPage
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.url = `/home/chats/${id}`;

    this.authPage.setupConstructor(this, []);
  }

  initializationTool() {
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
        this.complete = !0;
        if (this.privateChat) console.log(this.privateChat);
      }
    });

    this.search.publicChat(id).subscribe({
      error: () => this.error = !0,
      next: publicChat => this.publicChat = publicChat,
      complete: () => {
        this.complete = !0;
        if (this.publicChat) console.log(this.publicChat);
      }
    });
  }
}
