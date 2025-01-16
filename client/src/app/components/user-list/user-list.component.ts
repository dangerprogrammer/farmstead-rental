import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/types';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  @Input() user!: User;
  @Input() self!: User;

  @Output() onClick = new EventEmitter();

  redirect() {
    this.onClick.emit(this.user);
  }

}