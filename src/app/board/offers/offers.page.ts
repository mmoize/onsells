import { Product } from './../product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from './../post.service';
import { Post } from './../post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonItemSliding, NavController, LoadingController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  private postSub: Subscription;
  private prodSub: Subscription;
  isLoading = false;
  loadedOffers: Post[];
  loadedProducts: Product[];
  loadingProduct;
  loadedUserPosts: Post[];
  userPostCount;
  ClickedProdImage = false;
  productPhotoCount;
  loaded = false;


  slideOpts = {
    slidesPerView: 3,
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
              private route: ActivatedRoute,
              private routes: Router,
              private loadingCtrl: LoadingController,
              ) { }

  ngOnInit() {

  }

  checkRoleExistenceProduct(id: string):boolean {
    return this.loadedProducts.some(r => r.id === id);
  }

  checkRoleExistencePost(id: string):boolean {
    return this.loadedUserPosts.some(r => r.id === id);
  }

  async ionViewWillEnter() {
     this.isLoading = true;
     this.postservice.fetchPosts().subscribe(() => {
       this.isLoading = false;
     });

    ////////////////////--product--///////////////////////////////////

     const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
     const dic = JSON.parse(value);
     const dicToken = dic.token;

     this.postservice.fetchProducts(dicToken).subscribe( data => {
      // this.postservice.getProducts.subscribe(data => {
      //   if (!this.loadedProducts) {
      //       this.loadedProducts = data;
      //   } else {
      //     for (const key in this.loadedProducts)  {
      //       if (this.loadedProducts.hasOwnProperty(key)) {
      //         if (this.loadedProducts[key].id in this.loadedProducts) {
      //         } else {
      //           this.loadedProducts.push(this.loadedProducts[key]);
      //         }
      //       }
      //     }
      //   }
      //   console.log('offer prod data', data);
      // });
     });


     setTimeout(() => {
      this.prodSub = this.postservice.getProducts.subscribe(prodData => {

        // this.listedLoadedPosts = postData;
        // const checkRoleExistence = roleParam => this.listedLoadedPosts.some( data => data.id === roleParam );
        // console.log('second resultsaa', checkRoleExistence(postData[key].id));
        this.loadingProduct = prodData;
        if (!this.loaded) {
          this.loadedProducts = prodData;
          this.loaded =true;
        } else {

          for (const key in this.loadedProducts) {
            if (this.loadedProducts.hasOwnProperty(key)) {
              const checkRoleExistence = roleParam => this.loadingProduct.some( data => data.id === roleParam );
              const itshere = checkRoleExistence(this.loadedProducts[key].id);
              console.log('my others azx', itshere);
              if (itshere) {
                  console.log('yes its in here',prodData[key].id);
              } else  {
                let b = this.loadedProducts.filter(b => b.id !== this.loadedProducts[key].id);

                this.loadedProducts = b;
                  //this.loadedProducts .push(prodData[key]);
              }
            }
          }


          for (const key in this.loadingProduct) {
            if (this.loadingProduct.hasOwnProperty(key)) {
              const checkRoleExistencepost = roleParam => this.loadedProducts.some( data => data.id === roleParam );
              const itshere = checkRoleExistencepost(this.loadingProduct[key].id);
              if (itshere) {
                console.log('its here', );
              } else {
                //console.log('its not here', this.loadingPosts[key]);
                // this.listedLoadedPosts.push(this.loadingPosts[key]);
                this.loadedProducts.unshift(this.loadingProduct[key]);
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
    }, 1500);






     this.postservice.fetchUserPosts(dicToken).subscribe(data => {
       this.postservice.getUserPosts.subscribe(resData => {
         this.loadedUserPosts = resData;
         const count = Object.keys(this.loadedUserPosts).length;
         this.userPostCount = count;
       });
     });


     setTimeout(() => {
      this.postSub = this.postservice.getUserPosts.subscribe(postData => {

        // this.listedLoadedPosts = postData;
        // const checkRoleExistence = roleParam => this.listedLoadedPosts.some( data => data.id === roleParam );
        // console.log('second resultsaa', checkRoleExistence(postData[key].id));

        if (!this.loadedUserPosts) {
          this.loadedUserPosts = postData;
        } else {

          for (const key in postData) {
            if (postData.hasOwnProperty(key)) {
              const itshere = this.checkRoleExistencePost(postData[key].id);
              console.log('my others azx', itshere);
              if (itshere) {
                  console.log('yes its in here',postData[key].id);
              } else  {
                  console.log('not in here', postData[key].id);
                  console.log('its the AList', this.loadedUserPosts );
                  this.loadedUserPosts.push(postData[key]);
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
    }, 1500);

  }

  onClickProdImage() {
    if (this.ClickedProdImage) {
      this.ClickedProdImage = false;
    } else {
      this.ClickedProdImage = true;
    }
  }

  onDelete(id) {
    this.loadingCtrl.create({ message: 'Deleting your product'}).then(loadingEl => {
      loadingEl.present();
      this.postservice.productDelete(id);

      setTimeout(() => {
       loadingEl.dismiss();
     }, 2000);
    });

    console.log('this is id', id);
    let b = this.loadedProducts.filter(b => b.id !== id);

    this.loadedProducts = b;
    console.log('this is id', b);


    // function shuffle(array) {
    //   let currentIndex = array.length, temporaryValue, randomIndex;

    //   // While there remain elements to shuffle...
    //   while (0 !== currentIndex) {

    //     // Pick a remaining element...
    //     randomIndex = Math.floor(Math.random() * currentIndex);
    //     currentIndex -= 1;

    //     // And swap it with the current element.
    //     temporaryValue = array[currentIndex];
    //     array[currentIndex] = array[randomIndex];
    //     array[randomIndex] = temporaryValue;
    //   }

    //   return array;
    // }


    // let c = this.loadedUserPosts.filter(b => b.id !== id);
    // // shuffle(c);
    // this.loadedUserPosts = c;
    // console.log('this x', this.loadedUserPosts)

    // if (this.loadedUserPosts) {
    //   const count = Object.keys(this.loadedUserPosts).length;
    //   this.productPhotoCount = count;

    // } else {
    //   const count = Object.keys(this.loadedUserPosts).length;
    //   this.productPhotoCount = count;
    // }

  }

  onDeleteListing(id) {
    let c = this.loadedUserPosts.filter(b => b.id !== id);
    this.loadedUserPosts = c;
    console.log('this is usersDEEEEEEl', c);

    this.postservice.onPostDelete(id).then(() => {
        // this.ionViewWillEnter();
      });
  }



  onEdit(postId: string, slidingitem: IonItemSliding)  {
    slidingitem.close();
    console.log(this.loadedOffers);
  }

  ngOnDestroy() {
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
  }

  onNewProduct() {
    this.routes.navigateByUrl(`/board/offers/new-product`);
  }

  onNewPostListing() {
    this.routes.navigateByUrl(`/board/offers/new-post`);
  }





}
