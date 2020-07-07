import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from './../../places.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { Place } from '../../place.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  
  isLoading = false;
  placeId: string;
  private placeSub: Subscription;
  place: Place;
  loadedPlaces: Place;
  form: FormGroup;

  constructor(private placeService: PlacesService,
              private route: ActivatedRoute,
              private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/offers');
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placeSub = this.placeService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.loadedPlaces = this.place;
        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          description: new FormControl(this.place.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(150)]
          })

        });
        this.isLoading = false;
      });
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  onUpdate() {
    this.loadingCtrl.create({
      message: 'Updating place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placeService.updateOffer(
      this.place.id, this.form.value.title,
      this.form.value.description).subscribe( () => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/places/offers']);
      });
    });

  }



}
