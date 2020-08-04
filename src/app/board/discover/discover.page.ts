import { FcmService } from './../../fcm.service';
import { Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthService } from './../../auth/auth.service';
import { PostService } from './../post.service';
import { Post } from './../post.model';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  isLoading = false;
  private postsSub: Subscription;
  loadedPosts: Post[];
  listedLoadedPosts: Post[];
  relevantPosts: Post[];

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


  constructor(private postservice: PostService,
              private authservice: AuthService,
              private routes: Router,
              

              ) { }

  ngOnInit() {
    this.postsSub = this.postservice.posts.subscribe(resultData => {
      this.loadedPosts = resultData; // data from post service.
      this.relevantPosts = this.loadedPosts;
      this.listedLoadedPosts = this.relevantPosts.slice(1);
    });
    console.log(this.loadedPosts);
    setTimeout(() => {
      this.postsSub = this.postservice.posts.subscribe(resultData => {
        this.loadedPosts = resultData; // data from post service.
        this.relevantPosts = this.loadedPosts;
        this.listedLoadedPosts = this.relevantPosts.slice(1);
        console.log('data postservice',resultData);
      });
    }, 4000);
  }


  ionViewWillEnter() {
   this.isLoading = true;
   this.postservice.fetchPosts().subscribe(() => {
     this.isLoading = false;
   });
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    this.authservice.userName.pipe(take(1)).subscribe(usernameRes => {
      console.log(event.detail);
      if (event.detail.value === 'all') {
        this.relevantPosts = this.loadedPosts;
        this.listedLoadedPosts = this.relevantPosts.slice(1);
      } else {
        // this.relevantPosts = this.loadedPosts.filter(post => post.owner['username'] !== usernameRes );
        console.log('this is post', this.relevantPosts);
        console.log('this username', usernameRes);
        this.listedLoadedPosts = this.relevantPosts.slice(1);
      }
    });

  }

  onDetail(id) {
    this.routes.navigateByUrl(`/board/discover/post-detail/${id}`)
  }

}
