import { PlaceLocation } from './location.model';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from 'src/app/places/place.model';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

interface PlaceData {
availableFrom: string;
availableTo: string;
description: string;
imageUrl: string;
price: number;
title: string;
userId: string;
location: PlaceLocation;
}

// [
//   new Place(
//      'p1',
//      'Sydney Mansion',
//      'In the heart of Sydney City',
//      'https://live.staticflickr.com/4687/38645626364_1c492b911a_n.jpg',
//      999.99,
//      new Date('2019-01-01'),
//      new Date('2019-12-31'),
//      'abc'
//      ),
//   new Place(
//        'p2',
//        'Penthouse, Darling Harbour',
//        'If you are looking for the ultimate view of sydney this stay will make your ego',
//        // tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
//        'https://3.bp.blogspot.com/-twIjvnkfXgo/XFmHlFHC5EI/AAAAAAAAFz8/z4OE7jBYky83uNL8ETKBRhLwABVjzzkYgCHMYCw/s1600/wallpaper-design-for-home-interiors-new-york-studio-apartments.jpg',
//        1500.99,
//        new Date('2019-01-01'),
//        new Date('2019-12-31'),
//        'abc'
//        ),
//   new Place(
//          'p3',
//          'Melbourne Hide Spot',
//          'The is your melbourne escape its all about where you want to spend your next, and this is your destination',
//          // tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
//          'https://3.bp.blogspot.com/-YDfBRnd_zPI/XFmHldvjBQI/AAAAAAAAF0A/5UkZ0FveqYMfzdY03EDS3UPIS2vRcGrTgCHMYCw/s1600/modern-take-a-tour-and-new-yorks-most-expensive-penthouse-suite-to.jpg',
//          3499.99,
//          new Date('2019-01-01'),
//          new Date('2019-12-31'),
//          'abc'
//          ),
//          new Place(
//            'p4',
//            'New york life style',
//            'The new york escape is at your finger tips, engulf your self this gigantic beautiful view',
//            // tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
//            'https://3.bp.blogspot.com/-ZUNdM_WHavA/XFmHmJ15_XI/AAAAAAAAF0I/bpBdKuAnMIU5rFgKaFZps0VljUR8odXDQCHMYCw/s1600/luxury-penthouses-in-dubai.jpg',
//            5000,
//            new Date('2019-01-01'),
//            new Date('2019-12-31'),
//            'abc'
//            ),
// ]

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  // tslint:disable-next-line: variable-name
  private _places = new BehaviorSubject<Place[]>([]) ;

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private httpService: HttpClient) { }

  fetchPlaces() {
   return this.authService.token.pipe(switchMap(token => {
      return this.httpService.get<{[Key: string]: PlaceData}>(`https://myplaces-ae5f2.firebaseio.com/offered-places.json?auth=${{token}}`)
    }))
    .pipe(map(resData => {
      const places = [];
      for (const Key in resData) {
        if (resData.hasOwnProperty(Key)) {
            places.push(new Place
              (Key,
                   resData[Key].title,
                   resData[Key].description,
                   resData[Key].imageUrl,
                   resData[Key].price,
                   new Date(resData[Key].availableFrom),
                   new Date(resData[Key].availableTo),
                   resData[Key].userId,
                   resData[Key].location
                  ));
        }
      }
      return places;
    }),
     tap(places => {
       this._places.next(places);
     })
    );
  }

  getPlace(id: string) {
    return this.httpService.get<PlaceData>(`https://myplaces-ae5f2.firebaseio.com/offered-places/${id}.json`)
    .pipe(map(placeData => {
      return new Place(
        id,
        placeData.title,
        placeData.description,
        placeData.imageUrl,
        placeData.price,
        new Date(placeData.availableFrom),
        new Date(placeData.availableTo),
        placeData.userId,
        placeData.location
          );
    }));
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.httpService.post<{imageUrl: string, imagePath: string}>
    ('https://us-central1-myplaces-ae5f2.cloudfunctions.net/storeImage', uploadData);
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation,
    imageUrl: string
    ) {
    let generatedId: string;
    let newPlace: Place;
    return this.authService.userId.pipe(take(1), switchMap(userId => {
      if (!userId) {
        throw new Error('No user Found');
      }
      newPlace = new Place(
        Math.random().toString(),
         title, description,
         imageUrl ,
         price,
         dateFrom,
         dateTo,
         userId,
         location
        );
      return this.httpService.post<{name: string}>('https://myplaces-ae5f2.firebaseio.com/offered-places.json',
         {...newPlace, id: null});

    }),
       switchMap(resData => {
         generatedId = resData.name;
         return this.places;
       }),
       take(1),
       tap(places => {
         newPlace.id = generatedId;
         this._places.next(places.concat(newPlace)); }
     ));

    // return this.places.pipe(take(1), delay(1000), tap(places => {
    //   this._places.next(places.concat(newPlace));

    // }));
  }

  updateOffer(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(take(1), switchMap(places => {
      if (!places || places.length <= 0) {
        return this.fetchPlaces();
      } else {
        return of(places);
      }
    }), switchMap(places => {
      const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
      updatedPlaces = [...places];
      const oldPlace = updatedPlaces[updatedPlaceIndex];
      updatedPlaces[updatedPlaceIndex] =
       new Place(oldPlace.id,
          title, description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
          );
      return     this.httpService.put(`https://myplaces-ae5f2.firebaseio.com/offered-places/${placeId}.json`,
          {... updatedPlaces[updatedPlaceIndex], id: null }
          );
    }),
    tap(() => {
      this._places.next(updatedPlaces);
    }));
  }
}
