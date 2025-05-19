import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginStarted: boolean = !1;

  constructor(
    @Inject('AUTH_SERVICE') private readonly auth: AuthService,
    private router: Router,
    private loading: LoadingController
  ) {
    if (this.auth.token) this.router.navigate(['/home']);
  }

  async signIn() {
    const loading = await this.loading.create({
      message: 'Fazendo login',
      spinner: 'crescent'
    });

    this.loginStarted = !0;

    this.auth.login(async () => await loading.present(),
      () => {
        loading.dismiss();

        this.loginStarted = !1;
      }
    );
  }
}
