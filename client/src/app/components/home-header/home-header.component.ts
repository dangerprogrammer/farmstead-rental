import { Component, Inject, Input, ViewChild } from '@angular/core';
import { LoadingController, PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss']
})
export class HomeHeaderComponent {
  @ViewChild('mainPopover') mainPopover!: PopoverController;

  openDeleteAccount = !1;

  constructor(
    @Inject('AUTH_SERVICE') private auth: AuthService,
    private loading: LoadingController
  ) {}

  logout() {
    this.mainPopover.dismiss();

    this.auth.logout();
  }

  newDeleteAccount() {
    this.openDeleteAccount = !0;
  }

  onDismissDelete() {
    this.mainPopover.dismiss();
  }

  changeDeleteAccount(event: boolean) {
    this.openDeleteAccount = event;
  }

  async confirmDelete(del: (onConfirm?: Function) => void) {
    const loading = await this.loading.create({
      message: 'Excluindo conta',
      spinner: 'crescent'
    });

    await loading.present();

    await this.mainPopover.dismiss();

    del(() => loading.dismiss());
  }

  onSegmentChanged(event: CustomEvent) {
    // console.log(event.detail.value);
  }
}
