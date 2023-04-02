import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from '@angular/fire/auth';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedInUser$ = new Subject<User | null>();

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.loggedInUser$.next(user);
      } else {
        this.loginGuest().then(() => {});
      }
    });
  }

  login(email: string, password: string): Promise<void | UserCredential> {
    return signInWithEmailAndPassword(
      this.auth,
      <string>email,
      <string>password
    ).then(() => {});
  }

  signup(email: string, password: string): Promise<void | UserCredential> {
    return createUserWithEmailAndPassword(
      this.auth,
      <string>email,
      <string>password
    ).then(() => {});
  }

  signOut() {
    return signOut(this.auth).then(() => {
      this.loginGuest().then(() => {});
    });
  }

  loginGuest(): Promise<void | UserCredential> {
    return signInWithEmailAndPassword(
      this.auth,
      'guest@zewdu.com',
      '123456'
    ).then(() => {});
  }
}
