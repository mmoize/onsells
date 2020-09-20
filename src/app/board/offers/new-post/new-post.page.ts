import { PlaceLocation } from 'src/app/location.model';

import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../../post.service';
import { Plugins } from '@capacitor/core';
import { Product } from '../../product.model';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.page.html',
  styleUrls: ['./new-post.page.scss'],
})
export class NewPostPage implements OnInit {

  loadedProducts: Product[];
  userPostCount;
  selectedProduct;
  form: FormGroup;

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



  slideOpts1 = {
    slidesPerView: 1,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    on: {
      beforeInit() {
        const swiper = this;

        swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

        swiper.params.watchSlidesProgress = true;
        swiper.originalParams.watchSlidesProgress = true;
      },
      setTranslate() {
        const swiper = this;
        const {
          width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
        } = swiper;
        const params = swiper.params.coverflowEffect;
        const isHorizontal = swiper.isHorizontal();
        const transform$$1 = swiper.translate;
        const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
        const rotate = isHorizontal ? params.rotate : -params.rotate;
        const translate = params.depth;
        // Each slide offset from center
        for (let i = 0, length = slides.length; i < length; i += 1) {
          const $slideEl = slides.eq(i);
          const slideSize = slidesSizesGrid[i];
          const slideOffset = $slideEl[0].swiperSlideOffset;
          const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;

          let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
          let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
          // var rotateZ = 0
          let translateZ = -translate * Math.abs(offsetMultiplier);

          let translateY = isHorizontal ? 0 : params.stretch * (offsetMultiplier);
          let translateX = isHorizontal ? params.stretch * (offsetMultiplier) : 0;

           // Fix for ultra small values
          if (Math.abs(translateX) < 0.001) { translateX = 0; }
          if (Math.abs(translateY) < 0.001) { translateY = 0; }
          if (Math.abs(translateZ) < 0.001) { translateZ = 0; }
          if (Math.abs(rotateY) < 0.001) { rotateY = 0; }
          if (Math.abs(rotateX) < 0.001) { rotateX = 0; }

          // tslint:disable-next-line: max-line-length
          const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

          $slideEl.transform(slideTransform);
          $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
          if (params.slideShadows) {
            // Set shadows
            // tslint:disable-next-line: max-line-length
            let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            // tslint:disable-next-line: max-line-length
            let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if ($shadowBeforeEl.length === 0) {
              $shadowBeforeEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
              $slideEl.append($shadowBeforeEl);
            }
            if ($shadowAfterEl.length === 0) {
              $shadowAfterEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
              $slideEl.append($shadowAfterEl);
            }
            if ($shadowBeforeEl.length) { $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0; }
            if ($shadowAfterEl.length) { $shadowAfterEl[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0; }
          }
        }

         // Set correct perspective for IE10
        if (swiper.support.pointerEvents || swiper.support.prefixedPointerEvents) {
          const ws = $wrapperEl[0].style;
          ws.perspectiveOrigin = `${center}px 50%`;
        }
      },
      setTransition(duration) {
        const swiper = this;
        swiper.slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
      }
    }
  };




  constructor(private postservice: PostService,
              private routes: Router,
              private loadingCtrl: LoadingController,
              ) { }

  ngOnInit() {

    this.form = new FormGroup({
      latitude: new FormControl(null, {
        validators: [Validators.required
        ]}),
      longitude: new FormControl(null, {
        validators: [Validators.required
        ]}),
      // image: new FormControl(null)
    });
  }

  onLocationPicked(data) {
    this.form.patchValue({latitude: data.lat});
    this.form.patchValue({longitude: data.lng});
  }

  async ionViewDidEnter(){
  
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const dicToken = dic.token;


    this.postservice.fetchProducts(dicToken).subscribe( data => {
      this.postservice.getProducts.subscribe(data => {
        if (!this.loadedProducts) {
            this.loadedProducts = data;
            const count = Object.keys(this.loadedProducts).length;
            this.userPostCount = count;
        } else {
          for (const key in this.loadedProducts)  {
            if (this.loadedProducts.hasOwnProperty(key)) {
              if (this.loadedProducts[key].id in this.loadedProducts) {
              } else {
                this.loadedProducts.push(this.loadedProducts[key]);
              }
            }
          }
        }
        console.log('offer prod data', data);
      });
    });

  }


  async ionViewWillEnter() {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const dicToken = dic.token;


    this.postservice.fetchProducts(dicToken).subscribe( data => {
      this.postservice.getProducts.subscribe(data => {
        if (!this.loadedProducts) {
            this.loadedProducts = data;
            const count = Object.keys(this.loadedProducts).length;
            this.userPostCount = count;
        } else {
          for (const key in this.loadedProducts)  {
            if (this.loadedProducts.hasOwnProperty(key)) {
              if (this.loadedProducts[key].id in this.loadedProducts) {
              } else {
                this.loadedProducts.push(this.loadedProducts[key]);
              }
            }
          }
        }
        console.log('offer prod data', data);
      });
    });

  }


  onselectItem(item) {
    this.selectedProduct = item;
    console.log('this is selected item', this.selectedProduct);
  }

  onItemsSelect() {
    this.selectedProduct = null;
  }

  onCreatePostListing(data) {
   this.loadingCtrl.create({keyboardClose: true, message: 'Creating your item for listing'})
   .then(loadingEl => {
     loadingEl.present()
     const ProductData = new FormData();
     ProductData.append('title', this.selectedProduct.title);
     ProductData.append('slug', this.selectedProduct.slug);
     ProductData.append('latitude', this.form.value.latitude);
     ProductData.append('longitude', this.form.value.longitude);

     console.log('new listing', ProductData);
     this.postservice.createPostListing(ProductData).then(resData => {
      console.log('your new listing', resData);
    });
     setTimeout(() => {
      loadingEl.dismiss();
      this.routes.navigateByUrl(`/board/offers`);
    }, 2000);
    
   });
  }

  onNewProduct() {
    this.routes.navigateByUrl(`/board/offers/new-product`);
  }



}
