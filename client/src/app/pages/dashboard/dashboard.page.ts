import { ChangeDetectorRef, Component, Inject, NgZone } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ContextService } from 'src/app/services/context.service';
import { AuthPage, AuthSetup } from 'src/app/tools/auth.page';
import { Connection, User } from 'src/app/types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements AuthSetup {
  public user?: User;
  public usersLoaded: boolean = !1;
  public url = '/dashboard';

  private u!: User[];

  public get users() {
    return this.u;
  }

  private set users(u: User[]) {
    this.u = u;
    this.usersLoaded = !0;
  }

  constructor(
    @Inject('AUTH_SERVICE') private auth: AuthService,
    @Inject('CONTEXT_SERVICE') private context: ContextService,
    private authPage: AuthPage,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.authPage.setupConstructor(this, [
      {
        ev: 'update-connections', listener: ({ users, connections }: { users: User[], connections: Connection[] }) => {
          this.authPage.defListeners.updateConnections({ users, connections });

          users = this.context.getData('users');

          this.ngZone.run(() => {
            this.users = users;

            this.cdr.detectChanges();
          });
        }
      },
      {
        ev: 'update-user', listener: (user: User) => {
          this.authPage.defListeners.updateUser(user);

          const users = context.getData('users');

          this.ngZone.run(() => {
            this.user = user;

            if (users) this.users = users;

            this.cdr.detectChanges();
          });
        }
      },
      {
        ev: 'deleted-user', listener: (user: User) => {
          ngZone.run(() => {
            if (this.users) {
              this.context.setData('users', this.users.filter(u => u.sub != user.sub));

              const users = this.context.getData('users');

              if (users) {
                this.users = users;

                this.cdr.detectChanges();

              };
            };
          });
        }
      }
    ]);
  }

  initializationTool = () => {
    const users = this.context.getData('users'),
      user = this.context.getData('user');

    this.ngZone.run(() => {
      if (users) {
        this.users = users;
      };
      if (user) this.user = user;

      this.cdr.detectChanges();
    });
  }
}
