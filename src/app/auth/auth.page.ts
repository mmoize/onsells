import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ProfileService } from '../accounts/profile.service';
import * as firebase from 'firebase';





@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  form;
  isLogin = true;
  isPassReset = false;
  ispassTokenInput= false;

  isLoading = false;

  constructor(private authService: AuthService,
              private router: Router ,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private profileservice: ProfileService,
             ) { }

  ngOnInit() {

    this.form = new FormGroup({
      email: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      token: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
    });
  }


 authenticate(email: string, password: string, username: string) {
    this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in..' }).
    then(loadingEl => {
      loadingEl.present();
      let authObs: Observable<AuthResponseData>;
      if (this.isLogin) {
        authObs = this.authService.login(email, password);
      } else {
        authObs = this.authService.signup(email, password, username);
      }

      authObs.subscribe(resData => {
        console.log(resData);
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/board/discover');
      }, errRes => {
        loadingEl.dismiss();
        const code = errRes.error.error;
        let message = 'Could not sign you up, please try again.';
        if (code === 'EMAIL_EXISTS') {
           message = 'This Email already exists';
         } else if (code === 'EMAIL_NOT_fOUND') {
           message = 'E-mail address Could not be found.';
         } else if (code === 'INVALID_PASSWORD') {
           message = 'This password is not correct.';
         }
        this.showAlert(message);
      });

    });
    this.isLoading = true;
  }

  onPasswordReset() {

    const data = new FormData();
    data.append('email', this.form.value.email);
    console.log('this is reset email', this.form.value.email);

    this.authService.onRequestPasswordReset(data);

    setTimeout(() => {
      this.ispassTokenInput = true;
    }, 1000);

  }

  passwordOnTokenReset() {
    const data = new FormData();
    data.append('token', this.form.value.token);
    data.append('password', this.form.value.password);


    this.authService.onRequestNewPasswordReset(data);
    
    setTimeout(() => {
      this.isPassReset= false;
    }, 1000);

  }


  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const username = form.value.username;

    this.authenticate(email,  password, username);
    
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed',
      // tslint:disable-next-line: object-literal-shorthand
      message: message,
      buttons: ['okay']
    }).then(alertEl => {
      alertEl.present();
    });
  }

  onPassReset() {
    this.isPassReset = true;
  }

}
