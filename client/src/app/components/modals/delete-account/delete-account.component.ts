import { Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss'],
})
export class DeleteAccountComponent {
  @Input() openDeleteAccount: boolean = !1;

  @ViewChild('delete_account') deleteAccountModal!: ModalController;

  @Output() changeDeleteAccount = new EventEmitter<boolean>();
  @Output() dismissDelete = new EventEmitter();
  @Output() deleteAccount = new EventEmitter();

  constructor(
    @Inject('AUTH_SERVICE') private auth: AuthService
  ) { }

  confirmDelete() {
    this.deleteAccountModal.dismiss();

    this.deleteAccount.emit((onConfirm?: Function) => this.auth.delete(onConfirm));
  }

  cancelDelete() {
    this.deleteAccountModal.dismiss();
  }

  onDismissDelete() {
    this.openDeleteAccount = !1;

    this.changeDeleteAccount.emit(this.openDeleteAccount);
    this.dismissDelete.emit();
  }
}
