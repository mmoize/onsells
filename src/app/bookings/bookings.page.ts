import { environment } from '../../environments/environment';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { PlaceLocation, Coordinates } from '../location.model';



@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy, AfterViewInit {

  address:string;
  lat;
  long;  
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  map: any;
  
  @Input() center: {lat:-33.881840181840495, lng: 151.20684653014064};
  @Input() selectable = true;
  @Input() closeButtonText = 'cancel';
  @Input() title = 'Pick Location';
  cords;

  clickListener: any;

  googleMaps: any;

  @ViewChild('map', {static: true}) mapElementRef: ElementRef;

  constructor(private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private renderer: Renderer2) { }

  ngOnInit() {


  }



  ngAfterViewInit() {
    
  }

  ngOnDestroy() {
    //  if (this.clickListener) {
    //   this.googleMaps.event.removeListener(this.clickListener);
    //  }
  }

  onclick() {

    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }

    Plugins.Geolocation.getCurrentPosition().then(geoPosition => {
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      this.lat = geoPosition.coords.latitude;
    }).catch(err => {
      console.log(err);
      this.showErrorAlert();
    });

    this.getGoogleMaps().then(googleMaps => {
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        center: {lat: -33.881840181840495, lng: 151.20684653014064},
        zoom: 18
      });
      this.renderer.addClass(mapEl, 'visible');
      const marker =  new googleMaps.Marker({
        position: this.center,
        map: map,
        title: 'Hello World!'
      });
      if (this.selectable) {
        this.clickListener = map.addListener('click', event => {
          const selectedCoords = {
           lat: event.latLng.lat(),
           lng: event.latLng.lng()
          };
          this.cords = selectedCoords;
          console.log('this is cords', selectedCoords);
          const marker = new googleMaps.Circle({
            //position: this.cords,
            // tslint:disable-next-line: object-literal-shorthand
            map: map,
            title: 'Picked Location',
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            center: this.cords,
            radius: 47000
          });
          marker.setMap(map);

        });
      } else {
        console.log('this one');
        const marker = new googleMaps.Marker({
          position: this.center,
          // tslint:disable-next-line: object-literal-shorthand
          map: map,
          title: 'Picked Location'
        });
        marker.setMap(map);
      }
      }).catch( error => {
        console.log(error);
      });

  }

  private showErrorAlert() {
    this.alertCtrl.create({
      header: 'Could not fetch location',
      message: 'Please use the map to pick a location'
    }).then(alertEl => {
      alertEl.present();
    });
  }



  onCancel() {
    this.modalCtrl.dismiss();
  }

  private getGoogleMaps() {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    

    return new Promise ((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + environment.googleMapsApiKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available');
        }
      };
    });
  }

}
