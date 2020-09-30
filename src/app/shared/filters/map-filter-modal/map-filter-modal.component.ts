import { Component, OnInit, OnDestroy, AfterViewInit, Input, ViewChild, NgZone, Renderer2, ElementRef } from '@angular/core';
import { PlaceLocation, Coordinates } from '../../../location.model';
import { ModalController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Plugins, Capacitor } from '@capacitor/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-map-filter-modal',
  templateUrl: './map-filter-modal.component.html',
  styleUrls: ['./map-filter-modal.component.scss'],
})
export class MapFilterModalComponent implements OnInit, AfterViewInit, OnDestroy {
  map: any;
  address: string;
  placesId;
  lat;
  long;
  clickListener: any;

  autocomplete: { input: string; };
  autocompleteItems: any[];
  location = {};
  GoogleAutocomplete: any;


  distanceWithin = 20000;

  @Input() center: {lat: -33.881840181840495, lng: 151.20684653014064};
  @Input() selectable = true;
  @Input() closeButtonText = 'cancel';
  @Input() title = 'Pick Location';
  cords;
  circle;
  areaName;


  googleMaps: any;

  @ViewChild('map', {static: true}) mapElementRef: ElementRef;

  dontsearch = false;

  constructor(private modalCtrl: ModalController,
              private http: HttpClient,
              public zone: NgZone,
              private alertCtrl: AlertController,
              private renderer: Renderer2) {
    this.ngAfterViewInit();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.getGoogleMapsAutoComplete().then(googleMaps => {
      this.GoogleAutocomplete = new googleMaps.places.AutocompleteService();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      this.map = new googleMaps.Map(mapEl, {
        center: {lat: this.lat, lng: this.long},
        zoom: 10
      });

      this.googleMaps.event.addListenerOnce(this.map, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      });
    });
    }


    ngOnDestroy() {
      //  if (this.clickListener) {
      //   this.googleMaps.event.removeListener(this.clickListener);
      //  }
    }

  ngOnInit() {



  }

  ngAfterViewInit() {

    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }


    if (!this.center) {
      console.log('it was a');
      Plugins.Geolocation.getCurrentPosition().then(geoPosition => {
        const coordinates: Coordinates = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude
        };

        this.lat = geoPosition.coords.latitude;
        this.long = geoPosition.coords.longitude;
        // this.getAddress(this.lat, this.long).subscribe(() => {});
      }).catch(err => {
        console.log(err);
        this.showErrorAlert();
      });
    } else {
      console.log('it was b');
      this.lat = this.center.lat;
      this.long = this.center.lng;
      const mapEl = this.mapElementRef.nativeElement;
      this.map = new this.googleMaps.Map(mapEl, {
          center: {lat: this.lat, lng: this.long},
          zoom: 10
        });

      this.googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });

      if (this.selectable) {
          this.clickListener = this.map.addListener('click', event => {
            const selectedCoords = {
             lat: event.latLng.lat(),
             lng: event.latLng.lng()
            };
            this.lat = selectedCoords.lat;
            this.long = selectedCoords.lng;
            const marker = new this.googleMaps.Marker({
              position: selectedCoords,
              // tslint:disable-next-line: object-literal-shorthand
              map: this.map,
              title: 'Picked Location'
            });
            marker.setMap(this.map);

            this.circle = new this.googleMaps.Circle({
              // position: this.cords,
              // tslint:disable-next-line: object-literal-shorthand
              map: this.map,
              title: 'Picked Location',
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              center: selectedCoords,
              radius: this.distanceWithin
            });
            console.log('this is radi', this.distanceWithin);
            this.circle.setMap(this.map);
            this.circle.setVisible(true);






          });
        }


      }

  }


  // initiates the google maps sdks:

  // private getGoogleMaps() {
  //   const win = window as any;
  //   const googleModule = win.google;
  //   if (googleModule && googleModule.maps) {
  //     return Promise.resolve(googleModule.maps);
  //   }


  //   return new Promise ((resolve, reject) => {
  //     const script = document.createElement('script');
  //     script.src = 'https://maps.googleapis.com/maps/api/js?key=' + environment.googleMapsApiKey;
  //     script.async = true;
  //     script.defer = true;
  //     document.body.appendChild(script);
  //     script.onload = () => {
  //       const loadedGoogleModule = win.google;
  //       if (loadedGoogleModule && loadedGoogleModule.maps) {
  //         resolve(loadedGoogleModule.maps);
  //       } else {
  //         reject('Google maps SDK not available');
  //       }
  //     };
  //   });
  // }

  // private getAddress(lat: number, lng: number) {
  //   return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=
  //   ${environment.googleMapsApiKey}`
  //   ).pipe(map(geoData => {
  //     if (!geoData || !geoData.results || geoData.results.length === 0) {
  //       return null;
  //     }
  //     console.log(geoData.results[0].formatted_address);
  //     console.log(geoData.results[0].address_components[2].long_name);
  //     return geoData.results[0].formatted_address;
  //   })
  //   );
  // }



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



  private showErrorAlert() {
    this.alertCtrl.create({
      header: 'Could not fetch location',
      message: 'Please use the map to pick a location'
    }).then(alertEl => {
      alertEl.present();
    });
  }


onClickclose() {
    const locationData = {};
    locationData['lat']= this.lat;
    locationData['lng']= this.long;
    locationData['area_name']= this.areaName;
    this.modalCtrl.dismiss(locationData);
  }

SelectSearchResult(item) {
    /// WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING
    // alert(JSON.stringify(item));
    console.log('tthis is the results', item.structured_formatting.main_text);
    this.areaName = item.structured_formatting.main_text;
    this.placesId = item.place_id;
    this.selectable = false;
    this.getNewsearchCord();
    setTimeout(() => {
    this.ClearAutocomplete();
   }, 1000);
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




onclick() {
    // this.getGoogleMapsAutoComplete().then(googleMaps => {
    //   this.GoogleAutocomplete = new googleMaps.places.AutocompleteService();
    //   this.googleMaps = googleMaps;
    //   const mapEl = this.mapElementRef.nativeElement;
    //   this.map = new googleMaps.Map(mapEl, {
    //     center: {lat: this.lat, lng: this.long},
    //     zoom: 10
    //   });
    //   this.renderer.addClass(mapEl, 'visible');
      const marker =  new this.googleMaps.Marker({
        position: {lat: this.lat, lng: this.long},
        map: this.map,
        title: 'Hello World!'
      });
      marker.setMap(this.map);
      // if (this.selectable) {
      //   this.clickListener = map.addListener('click', event => {
      //     const selectedCoords = {
      //      lat: event.latLng.lat(),
      //      lng: event.latLng.lng()
      //     };
      //     this.cords = selectedCoords;
      //     console.log('this is cords', selectedCoords);
      //     // this.getAddress(event.latLng.lat(),  event.latLng.lng()).subscribe(() => {

      //     // });
      //     const marker = new googleMaps.Circle({
      //       // position: this.cords,
      //       // tslint:disable-next-line: object-literal-shorthand
      //       map: map,
      //       title: 'Picked Location',
      //       strokeColor: '#FF0000',
      //       strokeOpacity: 0.8,
      //       strokeWeight: 2,
      //       fillColor: '#FF0000',
      //       fillOpacity: 0.35,
      //       center: this.cords,
      //       radius: 47000
      //     });
      //     marker.setMap(map);

      //   });
      // } else {

      //   const geocoder = new googleMaps.Geocoder();
      //   //const sarchedmarker = new googleMaps.Marker({ map: map });
      //   const marker = new googleMaps.Circle({
      //     // position: this.cords,
      //     // tslint:disable-next-line: object-literal-shorthand
      //     map: map,
      //     title: 'Picked Location',
      //     strokeColor: '#FF0000',
      //     strokeOpacity: 0.8,
      //     strokeWeight: 2,
      //     fillColor: '#FF0000',
      //     fillOpacity: 0.35,
      //     radius: 47000
      //   });
      //   marker.setMap(map);

      //   geocoder.geocode({ placeId: this.placesId }, (results, status) => {
      //     if (status !== "OK") {
      //       window.alert("Geocoder failed due to: " + status);
      //       return;
      //     }
      //     map.setCenter(results[0].geometry.location);
      //     marker.setPlace({
      //       placeId: this.placesId,
      //       location: results[0].geometry.location
      //     });
      //     marker.setVisible(true);

      //   });



      //   // console.log('this one');
      //   // const marker = new googleMaps.Marker({
      //   //   position: this.center,
      //   //   // tslint:disable-next-line: object-literal-shorthand
      //   //   map: map,
      //   //   title: 'Picked Location'
      //   // });
      //   marker.setMap(map);
      // }
      // }).catch( error => {
      //   console.log(error);
    // });

  }


getnewClickCords() {




      const marker = new this.googleMaps.Marker({
        position: this.center,
        // tslint:disable-next-line: object-literal-shorthand
        map: this.map,
        title: 'Picked Location'
      });
      marker.setMap(this.map);



  }


getNewsearchCord() {

        const geocoder = new this.googleMaps.Geocoder();
        // const sarchedmarker = new googleMaps.Marker({ map: map });
        const marker = new this.googleMaps.Marker({
          // position: this.cords,
          // tslint:disable-next-line: object-literal-shorthand
          map: this.map,
          title: 'Picked Location',
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          radius: 47000
        });
        marker.setMap(this.map);
        let newCenter;
        geocoder.geocode({ placeId: this.placesId }, (results, status) => {
          if (status !== 'OK') {
            window.alert('Geocoder failed due to: ' + status);
            return;
          }
          this.map.setCenter(results[0].geometry.location);
          marker.setPlace({
            placeId: this.placesId,
            location: results[0].geometry.location
          });
          newCenter = results[0].geometry.location.lat;
          this.lat = results[0].geometry.location.lat();
          this.long = results[0].geometry.location.lng();
          console.log('newcenter', this.lat, this.long);

        });
        marker.setVisible(true);

        this.circle = new this.googleMaps.Circle({
          // position: this.cords,
          // tslint:disable-next-line: object-literal-shorthand
          map: this.map,
          title: 'Picked Location',
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          center: {lat: this.lat, lng: this.long},
          radius: 47000
        });
        this.circle.setMap(this.map);
        this.circle.setVisible(true);

  }

onChange(event) {
    console.log('this is change', event);
    console.log('this is circle', this.circle.radius);
    this.circle.radius = event;
    this.circle.setMap(this.map);
    this.circle.setVisible(true);

  }


  // GoTo(placeId) {
  //   let gmaps;
  //   let mapEl;
  //   let map;
  //   this.getGoogleMaps().then(googleMaps => {
  //     //console.log('this is m', googleMaps);
  //     gmaps = googleMaps;
  //     mapEl = this.mapElementRef.nativeElement;
  //     map = new gmaps.Map(mapEl, {
  //       // center: {lat: -34.397, lng: 150.644},
  //       zoom: 18
  //     });
  //     const geocoder = new googleMaps.Geocoder();
  //     const marker = new googleMaps.Marker({ map: map });


  //     geocoder.geocode({ placeId: placeId }, (results, status) => {
  //       if (status !== "OK") {
  //         window.alert("Geocoder failed due to: " + status);
  //         return;
  //       }
  //       map.setCenter(results[0].geometry.location);
  //       marker.setPlace({
  //         placeId: placeId,
  //         location: results[0].geometry.location
  //       });
  //       marker.setVisible(true);

  //     });

  //   });


  //   console.log('maaps', map);
  //   gmaps.event.addListenerOnce(map, 'idle', () => {
  //     this.renderer.addClass(mapEl, 'visible');
  //   });



  // }







}
