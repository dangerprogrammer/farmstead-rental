import { Component, Inject, ViewChild } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { forkJoin, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ContextService } from 'src/app/services/context.service';
import { SearchService } from 'src/app/services/search.service';
import { AuthPage } from 'src/app/tools/auth.page';
import { PrivateChat, PublicChat, User } from 'src/app/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
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
      { ev: 'update-users', listener: () => this.loadUsers() },
      { ev: 'update-user', listener: ({ user }: { user: User }) => this.updateUser(user) },
      { ev: 'update-private-chats', listener: () => this.loadPrivateChats() },
      { ev: 'update-public-chats', listener: () => this.loadPublicChats() },
    ]);
  }

  ionViewWillEnter() {
    this.loadSelf();

    this.loadPrivateChats();

    this.loadPublicChats();
  }

  loadUsers() {
    this.search.users().subscribe(users => {
      if (users) {
        users = this.authPage.defListeners.updateUsers(users);

        this.users = users;
        this.privateUsers = users;

        this.loadSelf();

        const privateChats = this.context.getData<PrivateChat[] | undefined>('private-chats');

        if (privateChats) this.privateUsers = this.filterPrivateUsers(users, privateChats);
      };
    });
  }

  loadSelf() {
    this.search.userByToken(this.auth.token).subscribe(googleSelf =>
      this.search.user(googleSelf.sub).subscribe(self => {
        if (self) {
          this.self = this.authPage.defListeners.updateSelf(self);
        };
      })
    );
  }

  updateUser(user: User) {
    if (this.users) {
      console.log('update-user');

      const users = this.authPage.defListeners.updateUsers(this.users.map((u) => {
        if (u.sub == user.sub) return user;

        return u;
      }));

      this.users = users;
      this.privateUsers = users;

      if (user.sub == this.self.sub) this.self = this.authPage.defListeners.updateSelf(user);

      this.loadPrivateChats();
    };
  }

  loadPrivateChats() {
    this.search.privateChats().subscribe(privateChats => {
      if (privateChats) {
        privateChats = this.authPage.defListeners.updatePrivateChats(privateChats);

        this.selfPrivateChats = privateChats;

        forkJoin((privateChats.map(({ id, users }) =>
          users.map(({ email, sub }) =>
            this.search.unreadMessagesByUser(id, sub).pipe(map(total => ({ total, email })))
          )
        )).flat()).subscribe(messages => {
          const date = new Date();
          console.groupCollapsed(`%c[${date.toLocaleString()}.${date.getMilliseconds()}] UNREAD-MESSAGES`, 'color: lightblue');

          messages.forEach(({ total, email }) => console.log(`Mensagens não lidas por ${email}`, total));

          console.groupEnd();
        });

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
        publicChats = this.authPage.defListeners.updatePublicChats(publicChats);

        this.selfPublicChats = publicChats;
      };
    });
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
    const privateChat: Partial<PrivateChat> = { users: [this.self!, user] };

    this.auth.socket.emit('create-private-chat', privateChat,
      () => this.forwardPrivateTalking()
      // ({ id }: PrivateChat) => setTimeout(() => this.router.navigate(['/', 'home', 'chats', id]), 5e2)
    );
  }
}
