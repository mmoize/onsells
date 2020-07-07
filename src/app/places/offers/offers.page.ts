import { ActivatedRoute } from '@angular/router';
import { PlacesService } from './../places.service';
import { Place } from './../place.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  private placesSub: Subscription;
  isLoading = false;
  loadedOffers: Place[];

  constructor(private placeOffers: PlacesService,
              private route: ActivatedRoute ) { }

  ngOnInit() {
    this.placesSub = this.placeOffers.places.subscribe(places => {
      this.loadedOffers = places;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placeOffers.fetchPlaces().subscribe(() => {
     this.isLoading = false;
   });
  }

  onEdit(offerId: string, slidingitem: IonItemSliding)  {
    slidingitem.close();
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }


}
