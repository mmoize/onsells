import { environment } from './../../../environments/environment';
import { ProfileService } from './../../accounts/profile.service';
import { Category } from './../category.model';
import { FcmService } from './../../fcm.service';
import { Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthService } from './../../auth/auth.service';
import { PostService } from './../post.service';
import { Post } from './../post.model';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { take, debounceTime, map, filter, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Plugins, Capacitor } from '@capacitor/core';
import { Platform, ModalController, ActionSheetController } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import {  Coordinates } from '../location.model';
import { MainFilterComponent } from 'src/app/shared/filters/main-filter/main-filter.component';
import { MapFilterModalComponent } from 'src/app/shared/filters/map-filter-modal/map-filter-modal.component';
import { MessageService } from 'src/app/messages/message.service';
import * as firebase from 'firebase';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {


  @ViewChild('itemSearch') itemSearch: ElementRef<any>;

  email;
  username;
  userid;
  userdp;


  testUsers = [];

  chatuserListTest = [];
  chatuserList;



  currentUserDP;

  public items: any;
  isLoading = false;
  private postsSub: Subscription;
  loadedPosts: Post[];
  listedLoadedPosts: Post[];
  relevantPosts: Post[];
  loadingPosts: Post[];
  loaded = false;
  isCategory = false;
  allCategory = false;
  categoryId;
  searching: any = false;
  searchTerm: string = '';
  searchControl: FormControl;
  searchtext;
  aboutToSearch = false;
  taggit;
  locationimage;

  
  currentAreaLocationName;
  latitude;
  longitude;
  onfilter = false;
  categorySelected = false;
  Selectedcategory;
  minFilterPrice;
  maxFilterPrice;

  // Category List-items: Displayed by a click event.
  categoryList = [
    new Category(
      '0',
      'Fleeks',
      'assets/icons/homeandgarden.svg'
    ),
    new Category(
      '1',
      'Home & Garden ',
      'assets/icons/homeandgarden.svg'
    ),
    new Category(
      '7',
      'Entertainment',
      'assets/icons/entertainment.svg'
    ),
    new Category(
      '3',
      'Electronics',
      'assets/icons/electronics.svg'

    ),
    new Category(
      '4',
      'Family',
      'assets/icons/family.svg'

    ),
    new Category(
      '2',
      'Clothing & Accessories',
      'assets/icons/clothingandaccessories.svg'

    ),
    // new Category(
    //   '5',
    //   'Classifieds',
    //   'assets/icons/classifieds.svg'
    // ),
    new Category(
      '6',
      'Hobbies',
      'assets/icons/Hobies.svg'
    ),

  ];


  // control's the category list slider.

  slideOpts = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.params = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { slides } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          let tx = -offset$$1;
          if (!swiper.params.virtualTranslate) { tx -= swiper.translate; }
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity = swiper.params.fadeEffect.crossFade
            ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
            : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl
            .css({
              opacity: slideOpacity,
            })
            .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          slides.transitionEnd(() => {
            if (eventTriggered) { return; }
            if (!swiper || swiper.destroyed) { return; }
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      },
    }
  };


constructor(public postservice: PostService,
            private routes: Router,
            private profileservice: ProfileService,
            public msgService: MessageService,
            private actionSheetCtrl: ActionSheetController,
            private http: HttpClient,
            private modalCtrl: ModalController,

              ) {
                this.searchControl = new FormControl();
                this.onSearchListings();
                this.getCurrentUserProfile();
                this.setCurrentUserDetails();

                setTimeout(() => {

                  // Set firebase credentials.

                  const users = [];
                  firebase.firestore().collection('chatUsers').get().then(resData => {
                    resData.forEach(childData => {
                      users.push(childData.data());
                      if (childData.data()['userid'] !== this.userid) {
                        users.push(childData.data());
                        this.testUsers.push(childData.data());
                      }

                    });
                    this.chatuserListTest = users;


                    const checkRoleExistence = roleParam => this.chatuserListTest.some( data => data.userid === roleParam );
                    const onexist = checkRoleExistence(this.userid);
                    console.log(' does user exist', onexist);
                    setTimeout(() => {
                      if (!onexist) {
                        // tslint:disable-next-line: no-unused-expression
                        this.msgService.createUser(
                          this.userid,
                        {'username': this.username,
                         'email': this.email,
                         'userid': this.userid,
                         'userdp': this.userdp,
                        'conversations': []}
                          ).then(() => {
                            // do nothing for now..
                          });  
                      } else {
                        this.setUpMsgService();
                      }
                    }, 500);
                  });
                }, 1000);


                this.PreloadPost();


               }

PreloadPost() {

  this.postsSub = this.postservice.postRes.subscribe(postData => {
    this.loadingPosts = postData;

    if (!this.loaded) {
      this.setUpListings();
      setTimeout(() => {
        this.listedLoadedPosts = postData;
        this.loaded = true;
      }, 400);
    } else if (this.listedLoadedPosts && this.loaded) {

      for (const key in this.listedLoadedPosts) {
        if (this.listedLoadedPosts.hasOwnProperty(key)) {
          const checkRoleExistence = roleParam => this.loadingPosts.some( data => data.id === roleParam );
          const listingExists = checkRoleExistence(this.listedLoadedPosts[key].id);

          if (listingExists) {

          } else  {
            let findx = this.listedLoadedPosts.filter(x => x.id !== this.listedLoadedPosts[key].id);

            this.listedLoadedPosts = findx;

            this.listedLoadedPosts.push(postData[key]);
            this.searching = false;
          }
        }
      }

      for (const key in this.loadingPosts) {
        if (this.loadingPosts.hasOwnProperty(key)) {
          const checkRoleExistencepost = roleParam => this.listedLoadedPosts.some( data => data.id === roleParam );
          const listingExists = checkRoleExistencepost(this.loadingPosts[key].id);
          if (listingExists) {
            // Do nothing.
          } else {
            this.listedLoadedPosts.unshift(this.loadingPosts[key]);
            this.searching = false;
          }
        }
      }

     // this.loaded = true;

    }

  });

}

  doRefresh(event) {
    this.onSearchListings().then(() => {
      this.PreloadPost();
    });
    setTimeout(() => {
      event.target.complete();
    }, 5000);
  }

async setCurrentUserDetails() {
  const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
  const userDicData = JSON.parse(value);

  this.email = userDicData.email;
  this.username = userDicData.username;
  this.userid = JSON.stringify(userDicData.user_id);


  this.profileservice.loadUserProfile(this.userid).subscribe(res => {
    this.userdp = JSON.stringify(res.image);
  });


}

  // checks if new listings are already in display
  checkRoleExistence(id: string):boolean {
      return this.loadedPosts.some(r => r.id === id);
    }

    setUpMsgService() {
      this.msgService.setCurrentUser(this.userid);
    }


   ngOnInit() {

    // When there's no selected category.
    if (!this.Selectedcategory) {
      this.Selectedcategory = this.categoryList[0];
    }

  }

  onSearch() {
    this.listedLoadedPosts = this.items;
  }

  async onSearchListings() {


  const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
  const dic = JSON.parse(value);
  const dicToken = dic.token;

  this.searchControl.valueChanges

 .pipe(
  filter(res => res.length > 2),
   debounceTime(700)
   )
 .subscribe(search => {
    this.taggit = search;

    const dicParam = {};
    dicParam['lat']= this.latitude;
    dicParam['lng'] = this.longitude;
    dicParam['usertoken'] = dicToken;
    dicParam['searchTerm'] = search;
    dicParam['taggit'] = this.taggit;

    if (this.categoryId === 0 || this.categoryId === undefined) {
        dicParam['category'] = 'None';
    } else {
      dicParam['category'] = this.categoryId.id;
    }
  
    this.searchTerm = search;

    this.postsSub = this.postservice.fetchPosts(dicParam).subscribe(resData => {
          if (resData.length >= 0) {
            this.postsSub = this.postservice.postRes.subscribe(postData => {
              this.listedLoadedPosts = postData;
              this.searching = false;
             
              setTimeout(() => {
                this.searchtext = '';
              }, 5000);
            });
          } else {
            this.searching = false;
          }

        });
      });
  }

    onSearchInput(ev) {

      if (ev.target.value.length <= 1) {
        this.searching = false;
      } else if (ev.target.value.length > 1) {
        this.searching = true;
      }

    }

    aboutTosearch() {

      if (this.aboutToSearch) {
        this.aboutToSearch = false;
      } else if (!this.aboutToSearch) {
        this.aboutToSearch = true;
      }

    }


    
  resetCategoryFilters(category) {
    this.minFilterPrice = undefined;
    this.maxFilterPrice = undefined;
    this.onClickedCategory(category);
  }


  // Sets the filters that fetches current listed Post within the user's radius.
  async onClickedCategory(category) {
    this.searching = true;
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const dicToken = dic.token;


    const category_id = category.id;

    const dicParam = {};
    dicParam['lat']= this.latitude;
    dicParam['lng'] = this.longitude;
    dicParam['usertoken'] = dicToken;
    dicParam['category'] = category_id ;

    if (this.minFilterPrice) {
      dicParam['minPrice'] = this.minFilterPrice;
    }
    if (this.maxFilterPrice) {
      dicParam['maxPrice'] = this.maxFilterPrice;
    }

    this.Selectedcategory = category;
    
    if (category_id !=='0') {
      this.allCategory = true;
      this.categorySelected = true;
      this.isLoading = true;

      this.postsSub = this.postservice.fetchPosts(dicParam).subscribe(data => {

        this.listedLoadedPosts = data;
        this.isLoading = false;
        this.searching = false;
      });
      // Closes the category slider after 15 seconds from opening it.
      setTimeout(() => {
        this.onfilter = false;
        this.categorySelected = false;
      }, 15500);

    // Else none of the offered categories are selected other than 'All'.
    } else {
      this.searching = true;
      this.allCategory = true;
      this.categorySelected = true;
      const allCategoryDicParam = {};
      dicParam['category'] = 'None';
      this.postsSub = this.postservice.fetchPosts(dicParam).subscribe(result => {
        this.postsSub = this.postservice.postRes.subscribe(postData => {
          console.log('its coming', postData);
          this.listedLoadedPosts = postData;
          this.searching = false;
        });
      });
      // Closes the category slider after 15 seconds from opening it.
      setTimeout(() => {
        this.categorySelected = false;
        this.onfilter = false;
        this.allCategory = false;
      },10500);

    }


  }
  // Locates the user's Locations by returning Both the Latitude and Longitude.
  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
       ///
      return;
    }

    Plugins.Geolocation.getCurrentPosition().then(geoPosition => {
      const Coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      this.latitude = Coordinates.lat;
      this.longitude = Coordinates.lng;
      this.locationimage = this.getMapImage(this.latitude, this.longitude, 10);
      this.getAddress(this.latitude, this.longitude);
      console.log('Error Locating the user', this.locationimage);
    }).catch(err => {
      console.log('Error Locating the user', err);
    });
  }

  async getCurrentUserProfile() {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const userid = dic.user_id;
    this.profileservice.loadUserProfile(userid).subscribe(resData => {
      this.currentUserDP = resData.image;
    });
  }

  async ionViewWillEnter() {

    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const dicToken = dic.token;

    if (this.listedLoadedPosts === undefined) {
      this.isLoading = true;
      this.searching = true;
    } else if (this.listedLoadedPosts !== undefined)  {
      this.searching =false;
    }   
    
  
  }

  async setUpListings() {

    this.locateUser();

    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const dicToken = dic.token;

    if (this.listedLoadedPosts === undefined) {
      this.isLoading = true;
    }

    setTimeout(() => {
        const dicParam = {};
        dicParam['lat']= this.latitude;
        dicParam['lng'] = this.longitude;
        dicParam['usertoken'] = dicToken;
        if (this.minFilterPrice) {
          dicParam['minPrice'] = this.minFilterPrice;
        }
        if (this.maxFilterPrice) {
          dicParam['maxPrice'] = this.maxFilterPrice;
        }
        this.postsSub = this.postservice.fetchPosts(dicParam).subscribe(result => {
          this.isLoading = false;
        });
  
      }, 200);

  }


onOpenFiltersModal() {
  this.modalCtrl.create({
    component: MainFilterComponent,
    componentProps: {'selectedCategory': this.Selectedcategory}
  }).then(modalEl => {
    modalEl.present();
    return modalEl.onDidDismiss().then(data => {
       console.log('filters results',  data.data.max);
       if (data.data.lat === undefined) {
         // do nothing. Theres no cordinates passed.
       } else {
        this.latitude = data.data.lat;
        this.longitude = data.data.lng;
       }
       this.maxFilterPrice = data.data.max;
       this.minFilterPrice =  data.data.min;

       this.onClickedCategory(this.Selectedcategory);
       this.locationimage = this.getMapImage(this.latitude, this.longitude, 10);
    });
  });
}


onOpenMapFiltersModal() {

  const center = {};
  center['lat']=this.latitude;
  center['lng'] = this.longitude;

  this.modalCtrl.create({
    component: MapFilterModalComponent,
    componentProps: {'center': center}
  }).then(modalEl => {
    modalEl.present();
    return modalEl.onDidDismiss().then(data => {
       console.log('filters results',  data.data );
       this.latitude = data.data.lat;
       this.longitude = data.data.lng;
       this.currentAreaLocationName = data.data.area_name;
       this.onClickedCategory(this.Selectedcategory);
    });
  });
}

  onDetail(id) {
    this.routes.navigateByUrl(`/board/discover/post-detail/${id}`);
    console.log('clickx', this.loaded);
  }

  ngOnDestroy() {
    if (this.postsSub) {
      this.postsSub.unsubscribe();
    }
  }

  onDisplayFilters() {
    if (this.onfilter) {
      this.onfilter = false;
    } else {
      this.onfilter = true;

    }
  }


  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.googleMapsApiKey}`;
  }


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
        this.latitude = coordinates.lat;
        this.longitude = coordinates.lng;
        this.locationimage = this.getMapImage(coordinates.lat, coordinates.lng, 10);
        this.onClickedCategory(this.Selectedcategory);
        this.getAddress( this.latitude, this.longitude).subscribe(resData => {
          console.log('address o1', resData.address_components[3]);
        });

      });
      modelEl.present();
    });
  }

  private getAddress(lat: number, lng: number) {
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=
    ${environment.googleMapsApiKey}`
    ).pipe(map(geoData => {
      if (!geoData || !geoData.results || geoData.results.length === 0) {
        return null;
      }
      this.currentAreaLocationName = geoData.results[0].address_components[3].short_name;
      console.log('yes11')
      return geoData.results[0].formatted_address;
    })
    );
  }


}
