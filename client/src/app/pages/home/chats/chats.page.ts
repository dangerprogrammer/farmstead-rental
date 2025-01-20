import { Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonTextarea } from '@ionic/angular';
import { IonTextareaCustomEvent } from '@ionic/core';
import { AuthService } from 'src/app/services/auth.service';
import { ContextService } from 'src/app/services/context.service';
import { SearchService } from 'src/app/services/search.service';
import { AuthPage, AuthSetup } from 'src/app/tools/auth.page';
import { Message, PrivateChat, PublicChat, User } from 'src/app/types';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements AuthSetup {
  @ViewChild('textarea') textarea!: IonTextarea;

  privateChat?: PrivateChat;
  publicChat?: PublicChat;

  messages?: Message[];

  error: boolean = !1;
  complete: boolean = !1;

  url: string;

  self!: User;

  messageContent!: string;

  enableSendMessage: boolean = !1;

  constructor(
    @Inject('AUTH_SERVICE') private auth: AuthService,
    @Inject('SEARCH_SERVICE') private search: SearchService,
    @Inject('CONTEXT_SERVICE') private context: ContextService,
    private route: ActivatedRoute,
    private router: Router,
    private authPage: AuthPage
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.url = `/home/chats/${id}`;

    this.authPage.setupConstructor(this, [
    ]);
  }

  initializationTool() {
    this.loadSelf();

    this.getChat();
  }

  loadSelf() {
    this.search.userByToken(this.auth.token).subscribe(self => {
      if (self) {
        this.authPage.defListeners.updateSelf(self);

        this.self = this.context.getData<User>('self');
      };
    });
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
        this.onCompleteLoad(id);
      }
    });

    this.search.publicChat(id).subscribe({
      error: () => this.error = !0,
      next: publicChat => this.publicChat = publicChat,
      complete: () => {
        this.onCompleteLoad(id);
      }
    });
  }

  private onCompleteLoad(id: string) {
    this.complete = !0;

    this.search.messagesByChat(id).subscribe(messages => {
      this.messages = messages;
    });
  }

  hasMessage({ detail: { value } }: IonTextareaCustomEvent<any>) {
    value = value.trim();

    this.enableSendMessage = !!value.length;
    this.messageContent = value;
  }

  sendMessage() {
    const details: Partial<Message> = {
      content: this.messageContent, owner: this.self,
      ...(this.privateChat ? { privateChat: this.privateChat } : {}),
      ...(this.publicChat ? { publicChat: this.publicChat } : {})
    };

    console.log(this.textarea.value);

    this.textarea.value = '';

    this.enableSendMessage = !1;
    this.messageContent = '';

    // this.auth.socket.emit('create-message', details);

    // this.auth.socket.on('receive-message', (message: Message) =>
    //   console.log(message)
    // );
  }
}
