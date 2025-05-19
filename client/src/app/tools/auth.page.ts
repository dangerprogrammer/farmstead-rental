import { Inject, Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Connection, Message, PrivateChat, PublicChat, User } from "../types";
import { ContextService } from "../services/context.service";
import { AlertController } from "@ionic/angular";

type constructorListener = {
  ev: string;
  listener: (...args: any[]) => void;
};

type listenerType = constructorListener & {
  listened?: boolean;
  page: string;
};

type page = {
  url: string;
};

@Injectable()
export class AuthPage {
  private listeners: listenerType[] = [];
  private pages: page[] = [];

  constructor(
    @Inject('AUTH_SERVICE') private auth: AuthService,
    @Inject('CONTEXT_SERVICE') private context: ContextService,
    private router: Router,
    private alert: AlertController
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
    this.listeners.push({ page: this.pages[this.pages.length - 1].url, ev, listener });
  }

  private initToolListeners: constructorListener[] = [
    {
      ev: 'update-users', listener: (users: User[]) => {
        this.defListeners.updateUsers(users);

        // this.auth.logSocket('update users', users);
      }
    },
    {
      ev: 'update-connections', listener: (connections: Connection[]) => {
        this.context.setData('connections', connections);
      }
    },
    {
      ev: 'update-private-chats', listener: (privateChats: PrivateChat[]) => {
        this.defListeners.updatePrivateChats(privateChats);
      }
    },
    {
      ev: 'update-public-chats', listener: (publicChats: PublicChat[]) => {
        this.defListeners.updatePublicChats(publicChats);
      }
    },
    {
      ev: 'self', listener: (user: User) => {
        this.defListeners.updateSelf(user);

        // this.auth.logSocket('user self', user);
      }
    },
    {
      ev: 'update-messages-chat', listener: ({ chatId, messages }: { chatId: string, messages: Message[] }) => {
        this.defListeners.updateChatMessages({ chatId, messages });
      }
    }
  ];

  private async initDefaultTool() {
    const hasToken = this.auth.verifyToken(),
      authToken = this.context.getData('auth-token');

    if (!hasToken || (authToken && authToken == this.auth.token)) return;

    const { socket: oldSocket, expiration } = this.auth;

    const expired = expiration - new Date().getTime() / 1e3;

    this.auth.logSocket(`Expiration: ${expiration}\nExpired: ${expired}`);

    if (expired <= 0) {
      const alertDisconnect = await this.alert.create({
        header: 'Você foi desconectado!',
        message: 'Sou token de acesso expirou, faça login novamente para continuar.',
        buttons: [{
          text: 'Ok',
          role: 'destructive',
          cssClass: 'ion-alert-confirm ion-color-main'
        }]
      });

      await alertDisconnect.present();

      await this.auth.logout();
    };

    if (!oldSocket || !oldSocket.connected || (oldSocket.auth as any).authorization != this.auth.token) await this.auth.setupSocket();

    const { socket } = this.auth;

    socket.on('disconnect', async () => {
      socket.removeAllListeners();

      await this.auth.logout();
    });

    this.initToolListeners.forEach(({ ev, listener }) => {
      socket.on(ev, (...args: any[]) => {
        listener(...args);

        const pageListener = this.listeners.find(({ ev: listenerEv }) => ev == listenerEv);

        if (pageListener) {
          this.auth.logSocket(`O listener default "${ev}" foi encontrado na página`);
          pageListener.listener(...args);

          pageListener.listened = !0;
        };
      });
    });

    this.listeners.filter(({ listened }) => !listened).forEach(({ page, ev, listener }) => {
      const { socket } = this.auth;

      this.auth.logSocket(`O listener default "${ev}" NÃO foi encontrado na página`);
      socket.on(ev, listener);
    });

    this.context.setData('auth-token', this.auth.token);
  }

  public defListeners = {
    updateUsers: (users: User[]) => {
      users = users.sort(this.sortUsers);

      const self = this.context.getData<User | undefined>('self');

      if (self) users = users.reduce<User[]>((order, u) => this.reduceUsers(order, u, self), []);

      this.context.setData('users', users);

      return users;
    },

    updateSelf: (self: User) => {
      const users = this.context.getData<User[] | undefined>('users');

      if (users) this.context.setData('users', users.reduce<User[]>((order, u) => this.reduceUsers(order, u, self), []));

      const privateChats = this.context.getData<PrivateChat[]>('private-chats');

      if (privateChats) this.context.setData('private-chats', privateChats.filter(({ users }) => users.find(({ sub }) => sub == self.sub)));

      this.context.setData('self', self);

      return self;
    },

    updatePrivateChats: (privateChats: PrivateChat[]) => {
      const self = this.context.getData<User | undefined>('self');

      if (self) privateChats = privateChats.filter(({ users }) => users.find(({ sub }) => sub == self.sub));

      this.context.setData('private-chats', privateChats);

      return privateChats;
    },

    updatePublicChats: (publicChats: PublicChat[]) => {
      const self = this.context.getData<User | undefined>('self');

      if (self) publicChats = publicChats.filter(({ users }) => users.find(({ sub }) => sub == self.sub));

      this.context.setData('public-chats', publicChats);

      return publicChats;
    },

    updateChatMessages: ({ chatId, messages }: { chatId: string, messages: Message[] }) => {
      this.context.setData(`chat-${chatId}-messages`, messages);

      return messages;
    }
  };

  private sortUsers = (a: User, b: User) => a.name > b.name ? 1 : a.name < b.name ? -1 : a.email > b.email ? 1 : a.email < b.email ? -1 : 0;

  private reduceUsers = (order: User[], u: User, self: User) => u.sub == self.sub ? [u, ...order] : [...order, u];
}