import { Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonTextarea } from '@ionic/angular';
import { IonTextareaCustomEvent } from '@ionic/core';
import { AuthService } from 'src/app/services/auth.service';
import { ContextService } from 'src/app/services/context.service';
import { SearchService } from 'src/app/services/search.service';
import { AuthPage } from 'src/app/tools/auth.page';
import { Message, PendingMessage, PrivateChat, PublicChat, User } from 'src/app/types';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage {
  @ViewChild('textarea') textarea!: IonTextarea;

  privateChat?: PrivateChat;
  publicChat?: PublicChat;

  messages?: Message[];
  pendingMessages: PendingMessage[] = [];

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
    const chatId = this.route.snapshot.paramMap.get('id')!;

    this.url = `/home/chats/${chatId}`;

    this.authPage.setupConstructor(this, [
      {
        ev: 'update-messages-chat', listener: ({ chatId: chId }: { chatId: string }) => this.updateMessages(chId)
      }
    ]);
  }

  ionViewWillEnter() {
    this.loadSelf();

    this.getChat();
  }

  loadSelf() {
    const chatId = this.route.snapshot.paramMap.get('id')!;

    this.search.userByToken(this.auth.token).subscribe(googleSelf =>
      this.search.user(googleSelf.sub).subscribe(self => {
        if (self) {
          this.authPage.defListeners.updateSelf(self);

          this.self = this.context.getData<User>('self');

          this.auth.socket.emit('visualize-message', { sub: self.sub, chatId });
        };
      })
    );
  }

  backHome() {
    this.router.navigate(['/', 'home']);
  }

  getChat() {
    const chatId = this.route.snapshot.paramMap.get('id')!;

    this.search.privateChat(chatId).subscribe({
      error: () => this.error = !0,
      next: privateChat => this.privateChat = privateChat,
      complete: () => this.onCompleteLoad()
    });

    this.search.publicChat(chatId).subscribe({
      error: () => this.error = !0,
      next: publicChat => this.publicChat = publicChat,
      complete: () => this.onCompleteLoad()
    });
  }

  onMessageSent(message: Message) {
    const pendingIndex = this.pendingMessages.findIndex(pMessage => (message.sendAt as any as string) == pMessage.sendAt.toISOString())

    this.pendingMessages.splice(pendingIndex, 1);
  }

  updateMessages(chId?: string) {
    const chatId = this.route.snapshot.paramMap.get('id')!;

    if (chId && chId != chatId) return;

    this.search.messagesByChat(chatId).subscribe(messages => {
      if (messages) {
        this.authPage.defListeners.updateChatMessages({ chatId, messages });

        messages = this.context.getData(`chat-${chatId}-messages`);

        this.messages = messages;

        console.log(messages);
      };
    });
  }

  private onCompleteLoad() {
    this.complete = !0;

    this.updateMessages();
  }

  hasMessage({ detail: { value } }: IonTextareaCustomEvent<any>) {
    value = value.trim();

    this.enableSendMessage = !!value.length;
    this.messageContent = value;
  }

  getAllMessages() {
    return [...(this.messages || []), ...this.pendingMessages];
  }

  sendMessage() {
    const details: PendingMessage = {
      content: this.messageContent, owner: this.self, sendAt: new Date(),
      visualizedBy: [this.self],
      ...(this.privateChat ? { privateChat: this.privateChat } : {}),
      ...(this.publicChat ? { publicChat: this.publicChat } : {})
    };

    this.textarea.value = '';

    this.enableSendMessage = !1;
    this.messageContent = '';

    this.textarea.setFocus();

    this.pendingMessages.push(details);

    this.auth.socket.emit('create-message', details, (message: Message) => this.onMessageSent(message));
  }
}
