import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase.service/firebase.service';
import { AuthService } from './services/auth-service/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './modals/login/login.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'bookapp';
  userName: string | null | undefined = '';
  authSub!: Subscription;
  getUserDataSub!: Subscription;

  constructor(
    private firebase: FirebaseService,
    private authService: AuthService,
    private route: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.authService.loggedInUser$.subscribe((user) => {
      if (user) {
        this.userName = user.email?.substring(0, user.email?.indexOf('@'));
      }
    });
  }

  goToEditPage() {
    this.firebase.goToEditPage();
  }

  logout() {
    this.authService.loginGuest().then(() => {});
    this.route.navigate(['home']).then(() => {});
  }

  openLoginPage() {
    this.dialog.open(LoginComponent);
  }

  pageUrl(url: string) {
    return this.route.url == `/${url}`;
  }

  goToHome() {
    this.route.navigate(['home']).then(() => {});
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.getUserDataSub.unsubscribe();
  }
}
