import { Inject, Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Connection, Message, PrivateChat, PublicChat, User } from "../types";
import { ContextService } from "../services/context.service";

type constructorListener = {
  ev: string;
  listener: (...args: any[]) => void;
};

type listenerType = constructorListener & {
  page: string;
};

type page = {
  url: string;
};

@Injectable()
export class AuthPage {
  private listeners: listenerType[] = [];
  private pages: page[] = [];
  private url!: string;

  constructor(
    @Inject('AUTH_SERVICE') private auth: AuthService,
    @Inject('CONTEXT_SERVICE') private context: ContextService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url != "/login") this.initDefaultTool();
    });
  }

  public setupConstructor = (page: page, listeners?: constructorListener[]) => {
    const { url } = page, pageContext = this.context.getData(url);

    if (pageContext) return;

    this.setup(page);

    listeners?.forEach(({ ev, listener }) => this.on(ev, listener));
  }

  private setup = (page: page) => {
    const { url } = page;

    this.context.setData(url, page);

    this.pages.push(page);
  }

  private on = (ev: string, listener: (...args: any[]) => void) => {
    this.listeners.push({ page: this.url, ev, listener });
  }

  private async initDefaultTool() {
    const hasToken = this.auth.verifyToken(),
      authToken = this.context.getData('auth-tool-token');

    if (!hasToken || (authToken && authToken == this.auth.token)) return;

    const { socket: oldSocket, expiration } = this.auth;

    const expired = expiration - new Date().getTime() / 1e3;

    if (expired < 0) await this.auth.logout();

    if (hasToken && (!oldSocket || !oldSocket.connected || (oldSocket.auth as any).authorization != this.auth.token)) this.auth.setupSocket();

    const { socket } = this.auth;

    socket.on('update-users', (users: User[]) => {
      this.defListeners.updateUsers(users);

      // this.auth.logSocket('update users', users);
    });

    socket.on('update-connections', (connections: Connection[]) => {
      this.context.setData('connections', connections);
    });

    socket.on('update-private-chats', (privateChats: PrivateChat[]) => {
      this.defListeners.updatePrivateChats(privateChats);
    });

    socket.on('update-public-chats', (publicChats: PublicChat[]) => {
      this.defListeners.updatePublicChats(publicChats);
    });

    socket.on('self', (user: User) => {
      this.defListeners.updateSelf(user);

      // this.auth.logSocket('user self', user);
    });

    socket.on('update-messages-chat', ({ chatId, messages }: { chatId: string, messages: Message[] }) => {
      this.defListeners.updateChatMessages({ chatId, messages });
    });

    this.listeners.forEach(({ ev, listener }) => {
      const { socket } = this.auth;

      socket.on(ev, listener);
    });

    this.context.setData('auth-tool-token', this.auth.token);
  }

  public defListeners = {
    updateUsers: (users: User[]) => {
      users = users.sort(this.sortUsers);

      const self = this.context.getData<User | undefined>('self');

      if (self) users = users.reduce<User[]>((order, u) => this.reduceUsers(order, u, self), []);

      this.context.setData('users', users);
    },

    updateSelf: (self: User) => {
      const users = this.context.getData<User[] | undefined>('users');

      if (users) this.context.setData('users', users.reduce<User[]>((order, u) => this.reduceUsers(order, u, self), []));

      const privateChats = this.context.getData<PrivateChat[]>('private-chats');

      if (privateChats) this.context.setData('private-chats', privateChats.filter(({ users }) => users.find(({ sub }) => sub == self.sub)));

      this.context.setData('self', self);
    },

    updatePrivateChats: (privateChats: PrivateChat[]) => {
      const self = this.context.getData<User | undefined>('self');

      if (self) privateChats = privateChats.filter(({ users }) => users.find(({ sub }) => sub == self.sub));

      this.context.setData('private-chats', privateChats);
    },

    updatePublicChats: (publicChats: PublicChat[]) => {
      const self = this.context.getData<User | undefined>('self');

      if (self) publicChats = publicChats.filter(({ users }) => users.find(({ sub }) => sub == self.sub));

      this.context.setData('public-chats', publicChats);
    },

    updateChatMessages: ({ chatId, messages }: { chatId: string, messages: Message[] }) => {
      this.context.setData(`chat-${chatId}-messages`, messages);
    }
  };

  private sortUsers = (a: User, b: User) => a.name > b.name ? 1 : a.name < b.name ? -1 : a.email > b.email ? 1 : a.email < b.email ? -1 : 0;

  private reduceUsers = (order: User[], u: User, self: User) => u.sub == self.sub ? [u, ...order] : [...order, u];
}