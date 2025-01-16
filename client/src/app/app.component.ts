import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { AuthService } from './services/auth.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  segment = 'chats';

  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'bar-chart' },
    { title: 'Chats', url: '/chats', icon: 'chatbubbles' },
  ];

  hasNavbar: boolean = !1;

  constructor(
    private router: Router,
    private modalController: ModalController,
    @Inject('AUTH_SERVICE') private auth: AuthService
  ) {
    addIcons({ ...icons });
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.hasNavbar = this.router.url != '/login';
    });
  }

  logout() {
    this.auth.logout();
  }

  deleteAccount() {
    this.auth.delete();
  }

  confirm() {
    this.modalController.dismiss();

    this.deleteAccount();
  }

  cancel() {
    this.modalController.dismiss();
  }
}
