import { Component, Inject, ViewChild } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ContextService } from 'src/app/services/context.service';
import { SearchService } from 'src/app/services/search.service';
import { AuthPage, AuthSetup } from 'src/app/tools/auth.page';
import { PrivateChat, PublicChat, User } from 'src/app/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements AuthSetup {
  @ViewChild('newPrivateChatModal') newPrivateChatModal!: ModalController;
  @ViewChild('mainPopover') mainPopover!: PopoverController;
  @ViewChild('newPopover') newPopover!: PopoverController;

  openNewPrivateChat = !1;

  url = '/home';

  users?: User[];
  privateUsers?: User[];

  self!: User;
  selfPrivateChats?: PrivateChat[];
  selfPublicChats?: PublicChat[];

  constructor(
    @Inject('AUTH_SERVICE') private auth: AuthService,
    @Inject('SEARCH_SERVICE') private search: SearchService,
    @Inject('CONTEXT_SERVICE') private context: ContextService,
    private authPage: AuthPage
  ) {
    this.authPage.setupConstructor(this, [
      { ev: 'self', listener: () => this.loadSelf() },
      { ev: 'update-users', listener: () => this.loadUsers() },
      { ev: 'update-private-chats', listener: () => this.loadPrivateChats() },
      { ev: 'update-public-chats', listener: () => this.loadPublicChats() }
    ]);
  }

  loadUsers() {
    this.search.users().subscribe(users => {
      if (users) {
        this.authPage.defListeners.updateUsers(users);

        users = this.context.getData('users');

        this.users = users;
      };
    });
  }

  loadSelf() {
    const self = this.context.getData<User | undefined>('self');

    if (self) {
      this.authPage.defListeners.updateSelf(self);

      this.self = this.context.getData<User>('self');

      const privateChats = this.context.getData<PrivateChat[] | undefined>('private-chats');

      if (privateChats) this.selfPrivateChats = privateChats;

      const publicChats = this.context.getData<PublicChat[] | undefined>('public-chats');

      if (publicChats) this.selfPublicChats = publicChats;

      const users = this.context.getData<User[] | undefined>('users');

      if (users) {
        this.users = users;
        this.privateUsers = users;

        if (privateChats) this.privateUsers = this.filterPrivateUsers(users, privateChats);
      };
    };
  }

  loadPrivateChats() {
    this.search.privateChats().subscribe(privateChats => {
      if (privateChats) {
        this.authPage.defListeners.updatePrivateChats(privateChats);

        privateChats = this.context.getData('private-chats');

        this.selfPrivateChats = privateChats;

        this.forwardPrivateTalking();

        const users = this.context.getData<User[] | undefined>('users');

        if (users) this.privateUsers = this.filterPrivateUsers(users, privateChats);
      };
    });
  }

  filterPrivateUsers = (users: User[], privateChats: PrivateChat[]) => {
    const userInRoom = (sub: string, { users: pUsers }: PrivateChat) => pUsers.find(({ sub: pSub }, i) => sub == pSub && i == 1) || (pUsers.length == 1 && pUsers[0].sub == sub),
      usersFiltred = users.filter((({ sub }: User) => !privateChats.find(privateChat => userInRoom(sub, privateChat))));

    return usersFiltred;
  }

  loadPublicChats() {
    this.search.publicChats().subscribe(publicChats => {
      if (publicChats) {
        this.authPage.defListeners.updatePublicChats(publicChats);

        publicChats = this.context.getData('public-chats');

        this.selfPublicChats = publicChats;
      };
    });
  }

  initializationTool() {
    this.loadSelf();

    this.loadUsers();

    this.loadPrivateChats();

    this.loadPublicChats();
  }

  newPrivateChat() {
    this.openNewPrivateChat = !0;
  }

  onDismissNew() {
    this.newPopover.dismiss();
  }

  forwardPrivateTalking() {
    this.newPrivateChatModal.dismiss();
    this.openNewPrivateChat = !1;
  }

  startPrivateChat(user: User) {
    const privateChat = { users: [this.self, user] };

    this.auth.socket.emit('create-private-chat', privateChat);
  }
}
