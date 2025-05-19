import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Router } from '@angular/router';
import { GooglePayload, GoogleUser } from '../types';
import { Platform } from '@ionic/angular';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user?: GoogleUser;

  constructor(
    private http: HttpClient,
    private router: Router,
    private platform: Platform
  ) {
    this.platform.ready().then(() => GoogleAuth.initialize({
      clientId: '51626388269-dk4eop0ri15rqb0alt66sgpv3iqf39q8.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    }));
  }

  public socket!: Socket;

  get token() {
    return sessionStorage.getItem("token")!;
  }

  set token(token: string) {
    sessionStorage.setItem("token", token);
  }

  get expiration() {
    return Number(sessionStorage.getItem("expiration")!);
  }

  set expiration(exp: number) {
    sessionStorage.setItem("expiration", String(exp));
  }

  get headers() {
    return new HttpHeaders({ authorization: this.token });
  }

  verifyToken() {
    if (!this.token) this.router.navigate(['/login']);

    return !!this.token;
  }

  async login(onInit?: Function, onConfirm?: Function) {
    this.user = await GoogleAuth.signIn();

    if (!this.user.authentication.idToken) return !1;

    onInit && await onInit();

    this.token = this.user.authentication.idToken;

    this.http.post<GooglePayload>(`${environment.api}/auth/login`, { token: this.token }).subscribe(({ exp }) => {
      this.expiration = exp;

      onConfirm && onConfirm();

      this.router.navigate(['/home']);
    });

    return !0;
  }

  async logout() {
    if (this.token) (async () => {
      if (this.user) this.user = await GoogleAuth.signOut();

      this.socket?.removeAllListeners();

      this.socket?.disconnect();

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("expiration");
    })();

    this.router.navigate(['/login']);
  }

  delete(onConfirm?: Function) {
    if (this.socket) {
      this.socket.emit('delete-user', this.token, async () => {
        onConfirm && await onConfirm();

        this.logout();
      });
    } else this.logout();
  }

  public logSocket(...text: any[]) {
    const time = new Date().toLocaleString();

    console.log(`%c[${time}]`, 'color: lightblue', ...text);
  }

  public setupSocket() {
    if (this.socket) {
      console.log('Dando setupSocket e socket já existia!');
      this.socket.removeAllListeners();

      this.socket.disconnect();
    };

    this.socket = io(`${environment.api}/socket`, { auth: { authorization: this.token } });

    return new Promise((resolve: any, reject) => {
      this.socket.on('connect', () => resolve());
      this.socket.on('connect_error', () => reject());
    });
  }

  socketEmitters = {}
}