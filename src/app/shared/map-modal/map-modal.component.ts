import { environment } from './../../../environments/environment';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() center: {lat: -34.397, lng: 150.644};
  @Input() selectable = true;
  @Input() closeButtonText = 'cancel';
  @Input() title = 'Pick Location';

  clickListener: any;

  googleMaps: any;

  @ViewChild('map', {static: true}) mapElementRef: ElementRef;

  constructor(private modalCtrl: ModalController, private renderer: Renderer2) { }

  ngOnInit() {}


  ngAfterViewInit() {
    this.getGoogleMaps().then(googleMaps => {
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        center: {lat: -34.397, lng: 150.644},
        zoom: 18
      });

      this.googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      });
      if (this.selectable) {
        this.clickListener = map.addListener('click', event => {
          const selectedCoords = {
           lat: event.latLng.lat(),
           lng: event.latLng.lng()
          };
          this.modalCtrl.dismiss(selectedCoords);
        });
      } else {
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

  ngOnDestroy() {
     if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
     }
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
