import { switchMap } from 'rxjs/operators';
import { MapModalComponent } from './../../../shared/map-modal/map-modal.component';
import { AuthService } from './../../../auth/auth.service';
import { BookingService } from './../../../bookings/booking.service';
import { PlacesService } from './../../places.service';
import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { Place } from '../../place.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  isLoading = false;
  isBookable = false;
  place: Place;
  private aPlaceSub: Subscription;

  constructor(private router: Router,
              private navCtrl: NavController,
              private modalCtrl: ModalController,
              private placeService: PlacesService,
              private route: ActivatedRoute,
              private actionSheetCtrl: ActionSheetController,
              private bookingService: BookingService,
              private loadingCtrl: LoadingController,
              private authService: AuthService,
              private alertCtrl: AlertController,
     ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/discover');
        return;
      }
      this.isLoading = true;
      let fetchedUserId: string;
      this.authService.userId.pipe(switchMap(userId => {
        if (!userId) {
          throw new Error('Found no user!');
        }
        fetchedUserId = userId;
        return this.placeService.getPlace(paramMap.get('placeId'));
      })).subscribe( aPlace => {
         this.place = aPlace;
         this.isBookable = aPlace.userId !== fetchedUserId;
         this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'An error occurred!',
          message: 'Could not load place.',
          buttons: [{text: 'Okay', handler: () => {
             this.router.navigate(['/places/discover']);
          }
        }
      ]
    }).then(alertEl => alertEl.present());
    }
      );
    });

  }

  onBookPlace() {
    // this.navCtrl.navigateBack(['/places']);
    // this.router.navigateByUrl('/places');
    // this.navCtrl.pop();
    this.actionSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
          this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }

        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl.
    create({
      component: CreateBookingComponent,
      componentProps: { selectedPlace: this.place, selectedMode: mode }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      if (resultData.role === 'confirm') {
        this.loadingCtrl.create({
          message: 'Booking place ...'
        }).then (loadingEl => {
          loadingEl.present();
          const data = resultData.data.BookingData;
          this.bookingService.addBooking(
            this.place.id,
            this.place.title,
            this.place.imageUrl,
            data.firstName,
            data.lastName,
            data.guestNumber,
            data.startDate,
            data.endDate ).subscribe(() => {
              loadingEl.dismiss();
            });
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.aPlaceSub) {
      this.aPlaceSub.unsubscribe();
    }
  }

  onShowFullMap() {
    this.modalCtrl.create({component: MapModalComponent, componentProps: {
      center: {lat: this.place.location.lat, lng: this.place.location.lng},
      selectable: false,
      closeButtonText: 'Close',
      title: this.place.location.address
    }
  }).then(modalEl => {
      modalEl.present();
    });
  }
}
