import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

type CurrentPlatform = 'browser' | 'native'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private _currentPlatform: CurrentPlatform;

  androidPlatform  = false;
  iosPlatform = false;
  desktopPlatform = false;
  

  constructor(
    private platform: Platform,
  ) { 
    this.setCurrentPlatform();
  }





  private setCurrentPlatform() {
    // Are we on mobile platform? Yes if platform is ios or android, but not desktop or mobileweb, no otherwise
    if (this.platform.is('ios')) {
      this.iosPlatform = true;
      console.log('its ios');
    } else if ( this.platform.is('android')) {
      this.androidPlatform = true;
      console.log('its android');
    } else if (this.platform.is('desktop')) {
      this.desktopPlatform = true;
      console.log('its desk');
    }
  }

  ionViewWillEnter(){
    this.setCurrentPlatform();
  }

  ngOnInit() {
  }

}
