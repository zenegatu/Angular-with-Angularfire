import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loggedInUser!: User | null;
  error: string | null = null;
  guest_login?: { email: string; psw: string } | undefined;
  loginPage = true;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(10)],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialogRef: DialogRef
  ) {}

  ngOnInit(): void {}

  login(email: string, password: string) {
    this.authService
      .login(email, password)
      .then(() => {
        this.closeLoginPage();
      })
      .catch((error: any) => {
        this.error = error.message || 'An error has occurred';
      });
  }

  signUp(email: string, password: string) {
    this.authService
      .signup(email, password)
      .then(() => {
        this.closeLoginPage();
      })
      .catch((error: any) => {
        this.error = error.message || 'An error has occured';
      });
  }

  onSubmit() {
    let emailValue = this.loginForm.controls['email'].value;
    let pswdValue = this.loginForm.controls['password'].value;
    if (!this.loginPage) {
      this.signUp(<string>emailValue, <string>pswdValue);
    } else {
      this.login(<string>emailValue, <string>pswdValue);
    }
  }

  onSwitch() {
    this.loginPage = !this.loginPage;
  }

  logout() {
    this.authService.signOut().then((r) => {
      console.log('Logged Out....', r);
    });
  }

  closeLoginPage() {
    this.loginForm.reset();
    this.error = '';
    this.router.navigate(['home']).then(() => {});
    this.dialogRef.close();
  }
}
