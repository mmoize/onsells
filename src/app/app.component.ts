import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Plugins, Capacitor } from '@capacitor/core';

import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private authSub: Subscription;
  private previousAuthState = false;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }

    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }


  ngOnInit() {
   this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
     if (!this.authSub && this.previousAuthState !== isAuth ) {
      this.router.navigateByUrl('/auth');
     }

     this.previousAuthState = isAuth;

    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

}
