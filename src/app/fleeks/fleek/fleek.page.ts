import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor} from '@capacitor/core';
import { Storage } from '@capacitor/storage';
import { Geolocation } from '@capacitor/geolocation';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/accounts/profile.service';
import { PostService } from 'src/app/board/post.service';
import {  Coordinates } from '../../models/location.model';

import { IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';
import { Post } from 'src/app/models/post.model';


interface fleeksData {
  id: string;
  user: string;
  title: string;
  price: string;
  description: string;
  slug: string;
  created: string;

}

@Component({
  selector: 'app-fleek',
  templateUrl: './fleek.page.html',
  styleUrls: ['./fleek.page.scss'],
})
export class FleekPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;

  userdp;
  email;
  username;
  userid;

  loadingPosts;
  private postsSub: Subscription;
  loadedPosts: Post[];
  listedLoadedPosts: Post[];
  loaded = false;
  isLoading = false;
  latitude;
  longitude;

  onfilter = false;
  categorySelected = false;
  Selectedcategory;
  minFilterPrice;
  maxFilterPrice;


  fleeks;

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



  constructor(
    private profileservice: ProfileService,
    public postservice: PostService,
    private routes: Router,
  ) { 
    // Sets the fleeks page current user
    this.setCurrentUserDetails();
    this.PreloadPost();  
    
  }

  ngOnInit() {
    
  }






ionViewWillEnter() {
  if (this.listedLoadedPosts === undefined) {
    this.isLoading = true;
  }  
  setTimeout(() => {

}, 5000);
}



async setCurrentUserDetails() {
  const { value } = await Storage.get({ key : 'authData'}) ;
  const userDicData = JSON.parse(value);

  this.email = userDicData.email;
  this.username = userDicData.username;
  this.userid = JSON.stringify(userDicData.user_id);


  this.profileservice.loadUserProfile(this.userid).subscribe(res => {
    this.userdp = res.image;
    console.log('this is img', this.userdp);
  });

}


  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      ///
      return;
    }

    Geolocation.getCurrentPosition().then(geoPosition => {
      const Coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      this.latitude = Coordinates.lat;
      this.longitude = Coordinates.lng;
      console.log('hi people', Coordinates);
    }).catch(err => {
      console.log(err);
    });
  }

openMarketplace() {
  this.routes.navigateByUrl(`/board/discover`);
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
            }
          }
        }

      //this.loaded = true;

      }

    });

  }


  //Loads listings upon starting using gps/

  async setUpListings() {

    this.locateUser(); // location tracker

    const { value } = await Storage.get({ key : 'authData'}) ;
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

  loadData(event) {

    // Using settimeout to simulate api call 
    setTimeout(() => {



      //Hide Infinite List Loader on Complete
      event.target.complete();

      //Rerender Virtual Scroll List After Adding New Data
      this.virtualScroll.checkEnd();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.loadingPosts.length == 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }




}
