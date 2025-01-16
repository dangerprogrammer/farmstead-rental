import { Component } from '@angular/core';
import { AuthPage, AuthSetup } from 'src/app/tools/auth.page';
import { User } from 'src/app/types';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements AuthSetup {
  public user?: User;
  public usersLoaded: boolean = !1;
  public url = '/chats';

  private u!: User[];

  public get users() {
    return this.u;
  }

  private set users(u: User[]) {
    this.u = u;
    this.usersLoaded = !0;
  }

  constructor(
    private authPage: AuthPage
  ) {
    this.authPage.setupConstructor(this, []);
  }

  initializationTool = () => {
    console.log('custom init chats');
  }
}