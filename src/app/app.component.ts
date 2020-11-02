import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Plugins, Capacitor } from '@capacitor/core';


import { Platform } from '@ionic/angular';


import {
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';



const { PushNotifications, Modals } = Plugins;


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


   console.log('Initializing HomePage');

    // Register with Apple / Google to receive push via APNS/FCM
   PushNotifications.register();

    // On succcess, we should be able to receive notifications
   PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        alert('Push registration success, token: ' + token.value);
        console.log('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
   PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
   PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        // let audio1 = new Audio('assets/audio.mp3');
        // console.log('Audio');
        // audio1.play();
        alert('Push received: ' + JSON.stringify(notification));
        console.log('Push received: ', notification);

        const alertRet = Modals.alert({
          title: notification.title,
          message: notification.body
        });

      }
    );

    // Method called when tapping on a notification
   PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
        console.log('Push action performed: ' + notification);
      }
    );

  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

}
