import { environment } from '../../environments/environment';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input, NgZone } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { PlaceLocation, Coordinates } from '../location.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy, AfterViewInit {

  address: string;
  lat;
  long;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location = {};
  GoogleAutocomplete: any;
  map: any;
  dontsearch = false;

  @Input() center: {lat: -33.881840181840495, lng: 151.20684653014064};
  @Input() selectable = true;
  @Input() closeButtonText = 'cancel';
  @Input() title = 'Pick Location';
  cords;

  clickListener: any;

  googleMaps: any;

  @ViewChild('map', {static: true}) mapElementRef: ElementRef;

  constructor(private modalCtrl: ModalController,
              private http: HttpClient,
              public zone: NgZone,
              private alertCtrl: AlertController,
              private renderer: Renderer2) {
            
              this.autocomplete = { input: '' };
              this.autocompleteItems = [];
              }

  ngOnInit() {




    this.getGoogleMapsAutoComplete().then(googleMaps => {
      const mapEl = this.mapElementRef.nativeElement;
      this.GoogleAutocomplete = new googleMaps.places.AutocompleteService();
    });

    setTimeout(() => {
      console.log('maoss', this.GoogleAutocomplete );
      this.dontsearch = true;
   }, 3000);

  }



  ionViewWillEnter() {
    this.getGoogleMapsAutoComplete().then(googleMaps => {
      const mapEl = this.mapElementRef.nativeElement;
      this.GoogleAutocomplete = new googleMaps.places.AutocompleteService();
    });

    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }

    Plugins.Geolocation.getCurrentPosition().then(geoPosition => {
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      // this.location.lat= geoPosition.coords.latitude;
      // this.location.lng= geoPosition.coords.longitude;

      this.lat = geoPosition.coords.latitude;
      this.long = geoPosition.coords.longitude;
      console.log('this ita', this.location);
      this.getAddress(this.lat, this.long).subscribe(() => {});
    }).catch(err => {
      console.log(err);
      this.showErrorAlert();
    });

    this.onclick();
  }



  private getAddress(lat: number, lng: number) {
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=
    ${environment.googleMapsApiKey}`
    ).pipe(map(geoData => {
      if (!geoData || !geoData.results || geoData.results.length === 0) {
        return null;
      }
      console.log(geoData.results[0].formatted_address);
      console.log(geoData.results[0].address_components[2].long_name);
      return geoData.results[0].formatted_address;
    })
    );
  }



  ngAfterViewInit() {

  }

  ngOnDestroy() {
    //  if (this.clickListener) {
    //   this.googleMaps.event.removeListener(this.clickListener);
    //  }
  }

  onclick() {


    this.getGoogleMaps().then(googleMaps => {
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        center: {lat: this.lat, lng: this.long},
        zoom: 12
      });
      this.renderer.addClass(mapEl, 'visible');
      const marker =  new googleMaps.Marker({
        position: {lat: this.lat, lng: this.long},
        map,
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
          this.getAddress(event.latLng.lat(),  event.latLng.lng()).subscribe(() => {

          });
          const marker = new googleMaps.Circle({
            // position: this.cords,
            // tslint:disable-next-line: object-literal-shorthand
            map: map,
            title: 'Picked Location',
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
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

  private getGoogleMapsAutoComplete() {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }


    return new Promise ((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=' + environment.googleMapsApiKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
          console.log('its been ok');
        } else {
          console.log('its been rehehect');
          reject('Google maps SDK not available');
        }
      };
    });
  }






  SelectSearchResult(item) {
    /// WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING
    alert(JSON.stringify(item));
    console.log('tthis is the results', item);
    this.GoTo(item.place_id);
  }


  UpdateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }

  ClearAutocomplete() {
    this.autocompleteItems = [];
    this.autocomplete.input = '';
  }

  // sIMPLE EXAMPLE TO OPEN AN URL WITH THE PLACEID AS PARAMETER.


  GoTo(placeId) {
    let gmaps;
    let mapEl;
    let map;
    this.getGoogleMaps().then(googleMaps => {
      //console.log('this is m', googleMaps);
      gmaps = googleMaps;
      mapEl = this.mapElementRef.nativeElement;
      map = new gmaps.Map(mapEl, {
        // center: {lat: -34.397, lng: 150.644},
        zoom: 18
      });
      const geocoder = new googleMaps.Geocoder();
      const marker = new googleMaps.Marker({ map: map });


      geocoder.geocode({ placeId: placeId }, (results, status) => {
        if (status !== "OK") {
          window.alert("Geocoder failed due to: " + status);
          return;
        }
        map.setCenter(results[0].geometry.location);
        marker.setPlace({
          placeId: placeId,
          location: results[0].geometry.location
        });
        marker.setVisible(true);

      });

    });
    

    console.log('maaps', map);
    gmaps.event.addListenerOnce(map, 'idle', () => {
      this.renderer.addClass(mapEl, 'visible');
    });



  }




}
