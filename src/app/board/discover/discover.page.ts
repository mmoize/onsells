import { Category } from './../category.model';
import { FcmService } from './../../fcm.service';
import { Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthService } from './../../auth/auth.service';
import { PostService } from './../post.service';
import { Post } from './../post.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { take, debounceTime, map, filter, distinctUntilChanged } from 'rxjs/operators';
import { Plugins, Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import {  Coordinates } from '../location.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {


  @ViewChild('itemSearch') itemSearch: ElementRef<any>;
  public items: any;
  isLoading = false;
  private postsSub: Subscription;
  loadedPosts: Post[];
  listedLoadedPosts: Post[];
  relevantPosts: Post[];
  loadingPosts: Post[];
  loaded = false;
  isCategory = false;
  categoryId;
  searching: any = false;
  searchTerm: string = '';
  searchControl: FormControl;
  latitude;
  longitude;
  onfilter = false;


  categoryList = [
    new Category(
      '0',
      'All',
      'assets/icons/homeandgarden.svg'
    ),
    new Category(
      '1',
      'Home ',
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
    new Category(
      '5',
      'Classifieds',
      'assets/icons/classifieds.svg'
    ),
    new Category(
      '6',
      'Hobbies',
      'assets/icons/Hobies.svg'
    ),

  ];



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
            private authservice: AuthService,
            private routes: Router,
            private platForm: Platform
              // private fcm: FcmService

              ) {
                this.searchControl = new FormControl();
               }
  
checkRoleExistence(id: string):boolean {
    return this.loadedPosts.some(r => r.id === id);
  }





   ngOnInit() {
  
    setTimeout(() => {

      this.postsSub = this.postservice.postRes.subscribe(postData => {
        this.loadingPosts = postData;
  
       // console.log('second resultsaa', checkRoleExistence(postData[key].id));
        console.log('my others azx', this.loadingPosts );
        if (!this.loaded) {
          this.listedLoadedPosts = postData;
          this.loaded =true;
        } else {
          
          for (const key in this.listedLoadedPosts) {
            if (this.listedLoadedPosts.hasOwnProperty(key)) {
              const checkRoleExistence = roleParam => this.loadingPosts.some( data => data.id === roleParam );
              const itshere = checkRoleExistence(this.listedLoadedPosts[key].id);
              console.log('my others azx', itshere);
              if (itshere) {
                  console.log('yes its in here', this.listedLoadedPosts[key].id);
              } else  {
                let b = this.listedLoadedPosts.filter(b => b.id !== this.listedLoadedPosts[key].id);
  
                this.listedLoadedPosts = b;
  
                console.log('its the AList', this.listedLoadedPosts);
                this.listedLoadedPosts.push(postData[key]);
              }
            }
          }
          console.log('my others azx', this.listedLoadedPosts);
  
          for (const key in this.loadingPosts) {
            if (this.loadingPosts.hasOwnProperty(key)) {
              const checkRoleExistencepost = roleParam => this.listedLoadedPosts.some( data => data.id === roleParam );
              const itshere = checkRoleExistencepost(this.loadingPosts[key].id);
              if (itshere) {
                console.log('its here', );
              } else {
                console.log('its not here', this.loadingPosts[key]);
                // this.listedLoadedPosts.push(this.loadingPosts[key]);
                this.listedLoadedPosts.unshift(this.loadingPosts[key]);
              }
            }
          }
  
  
        }
  
      });
      // this.postsSub = this.postservice.posts.subscribe(resultData => {
      //   this.loadedPosts = resultData; // data from post service.
      //   this.relevantPosts = this.loadedPosts;
      //   this.listedLoadedPosts = this.relevantPosts.slice(1);
      //   console.log('data postservice',resultData);
      // });
    }, 1000);


  }

onSearch() {
    this.listedLoadedPosts = this.items;
  }

  async ionViewDidEnter(){
   


  const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
  const dic = JSON.parse(value);
  const dicToken = dic.token;
  console.log('for auth token', dicToken);
  this.searchControl.valueChanges
 .pipe(
  filter(res => res.length > 2),
   debounceTime(700)
   )
 .subscribe(search => {
  this.searchTerm= search;
  console.log('this is search', search);
   //this.setFilteredItems();
  this.postservice.fetchPostSearch(search, dicToken).subscribe(resData => {
     console.log('this is there posts', resData);
     if (resData.length >= 0) {
      this.listedLoadedPosts = resData;
      this.searching = false;
     } else {
       // this code displayes data after user search returns '0 posts'
       this.searching = false;
       setTimeout(() => {
         const categoryId = 0
         this.onClickedCategory(categoryId).then(resData => {
           console.log('test if its working', resData);
         });
       }, 1000);
     }

  });
 });
  }

onSearchInput(ev){
    this.searching = true;
    console.log('this is search ev',ev.target.value);
    if (ev.target.value.length <= 0) {
      this.searching = false;
      console.log('this is search ev',ev.target.value);
    } else if (ev.target.value.length > 0) {
      this.searching = true;
      console.log('this is search ev',ev.target.value);
    }
}

setFilteredItems() {
  this.items = this.postservice.filterItems(this.searchTerm);
  console.log('here is items', this.searchTerm);
}



  async onClickedCategory(category_id) {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const dicToken = dic.token;
    console.log('for auth token', dicToken);

    if (category_id !=='0') {
      this.isLoading = true;
      this.postservice.fetchPostCategory(category_id, dicToken).subscribe(data => {
        console.log('this is category data', data);
        this.listedLoadedPosts = data;
        this.isLoading = false;
      });
    } else {
      this.postservice.fetchPosts(this.latitude, this.longitude, dicToken).subscribe(result => {
        this.postsSub = this.postservice.postRes.subscribe(postData => {
          console.log('its coming', postData);
          this.listedLoadedPosts = postData;
        });
      });

    }


  }
  
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
    }).catch(err => {
      console.log(err);
    });
  }



  async ionViewWillEnter() {
  const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
  const dic = JSON.parse(value);
  const dicToken = dic.token;
  console.log('for auth token', dicToken);
  if (this.listedLoadedPosts === undefined) {
    this.isLoading= true;
  }

  this.locateUser()


  setTimeout(() => {
    this.postservice.fetchPosts(this.latitude, this.longitude, dicToken).subscribe(result => {
      this.isLoading = false;
    });
    // this.postsSub = this.postservice.postRes.subscribe(postData => {
    //   this.loadingPosts = postData;

    //  // console.log('second resultsaa', checkRoleExistence(postData[key].id));
    //   console.log('my others azx', this.loadingPosts );
    //   if (!this.loaded) {
    //     this.listedLoadedPosts = postData;
    //     this.loaded =true;
    //   } else {
        
    //     for (const key in this.listedLoadedPosts) {
    //       if (this.listedLoadedPosts.hasOwnProperty(key)) {
    //         const checkRoleExistence = roleParam => this.loadingPosts.some( data => data.id === roleParam );
    //         const itshere = checkRoleExistence(this.listedLoadedPosts[key].id);
    //         console.log('my others azx', itshere);
    //         if (itshere) {
    //             console.log('yes its in here', this.listedLoadedPosts[key].id);
    //         } else  {
    //           let b = this.listedLoadedPosts.filter(b => b.id !== this.listedLoadedPosts[key].id);

    //           this.listedLoadedPosts = b;

    //           console.log('its the AList', this.listedLoadedPosts);
    //           this.listedLoadedPosts.push(postData[key]);
    //         }
    //       }
    //     }
    //     console.log('my others azx', this.listedLoadedPosts);

    //     for (const key in this.loadingPosts) {
    //       if (this.loadingPosts.hasOwnProperty(key)) {
    //         const checkRoleExistencepost = roleParam => this.listedLoadedPosts.some( data => data.id === roleParam );
    //         const itshere = checkRoleExistencepost(this.loadingPosts[key].id);
    //         if (itshere) {
    //           console.log('its here', );
    //         } else {
    //           console.log('its not here', this.loadingPosts[key]);
    //           // this.listedLoadedPosts.push(this.loadingPosts[key]);
    //           this.listedLoadedPosts.unshift(this.loadingPosts[key]);
    //         }
    //       }
    //     }


    //   }

    // });
    // this.postsSub = this.postservice.posts.subscribe(resultData => {
    //   this.loadedPosts = resultData; // data from post service.
    //   this.relevantPosts = this.loadedPosts;
    //   this.listedLoadedPosts = this.relevantPosts.slice(1);
    //   console.log('data postservice',resultData);
    // });
  }, 2000);

}




  


  onDetail(id) {
    this.routes.navigateByUrl(`/board/discover/post-detail/${id}`);
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

}
