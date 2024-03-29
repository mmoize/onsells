
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Capacitor} from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Coordinates, PlaceLocation } from 'src/app/models/place-location.model';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  isLoading = false;
  selectedLocationImage: string;
  @Input() showPreview = false;

  constructor(private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private http: HttpClient,
              private alertCtrl: AlertController,
              ) { }

  ngOnInit() {}


  onPickLocation() {
    this.actionSheetCtrl.create({
      header: 'Please Choose',
      buttons: [
        {text: 'Auto-Locate', handler: () => {
          this.locateUser();
        }},
        {text: 'Pick on Map', handler: () => {
          this.openMap();
        }},
        {text: 'Cancel', role: 'cancel'}
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

  private openMap() {
    this.modalCtrl.create({component: MapModalComponent}).then(modelEl => {
      modelEl.onDidDismiss().then(modalData => {
        console.log('this is maps',modalData);
        if (!modalData.data) {
          return;
        }
        const coordinates: Coordinates = {
           lat: modalData.data.lat,
           lng: modalData.data.lng
         };
        this.createPlace(coordinates.lat, coordinates.lng);
      });
      modelEl.present();
    });
  }
  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    this.isLoading = true;
    Geolocation.getCurrentPosition().then(geoPosition => {
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      this.createPlace(coordinates.lat, coordinates.lng);
      this.isLoading = false;
    }).catch(err => {
      console.log(err);
      this.isLoading = false;
      this.showErrorAlert();
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

  private getAddress(lat: number, lng: number) {
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=
    ${environment.firebase.apiKey}`
    ).pipe(map(geoData => {
      if (!geoData || !geoData.results || geoData.results.length === 0) {
        return null;
      }
      console.log(geoData.results[0].formatted_address);
      return geoData.results[0].formatted_address;
    })
    );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.firebase.apiKey}`;
  }

  private createPlace(lat: number, lng: number) {

    const pickedLocation: PlaceLocation = {
      // tslint:disable-next-line: object-literal-shorthand
      lat: lat,
      // tslint:disable-next-line: object-literal-shorthand
      lng: lng,
      address: null,
      staticMapImageUrl: null
    };
    this.isLoading = true;
    this.getAddress(lat, lng).
      pipe(switchMap(address => {
        pickedLocation.address = address;
        return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14));
      })
    ).subscribe(staticMapImageUrl => {
      pickedLocation.staticMapImageUrl = staticMapImageUrl;
      this.selectedLocationImage = staticMapImageUrl;
      this.isLoading = false;
      this.locationPick.emit(pickedLocation);
    });
  }

}
