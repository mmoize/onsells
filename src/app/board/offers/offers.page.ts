import { Product } from '../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from './../post.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonItemSliding, NavController, LoadingController, AlertController } from '@ionic/angular';
import { Post } from 'src/app/models/post.model';
import { Storage } from '@capacitor/storage';


@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  userHasLoadedItem = true;
  userHasLoadedListings = true;
  

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
  


  





  constructor(private postservice: PostService,
              private route: ActivatedRoute,
              private routes: Router,
              private loadingCtrl: LoadingController,
              private alertController: AlertController,
              ) { }

  ngOnInit() {
    setTimeout(() => {
      if(this.loadedProducts.length > 0) {
        this.userHasLoadedItem = true;
        
      } else if (this.loadedProducts.length <= 0) {
        this.userHasLoadedItem = false;
      }
    }, 3000);

    setTimeout(() => {
      if(this.loadedUserPosts.length > 0) {
        this.userHasLoadedListings = true;
        
      } else if (this.loadedUserPosts.length  <= 0) {
        this.userHasLoadedListings  = false;
      }
    }, 3000);


  }

  doRefresh(event) {

    this.ionViewWillEnter();
    this.ngOnInit();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  checkRoleExistenceProduct(id: string):boolean {
    return this.loadedProducts.some(r => r.id === id);
  }

  checkRoleExistencePost(id: string):boolean {
    return this.loadedUserPosts.some(r => r.id === id);
  }

  async ionViewWillEnter() { 
     
    

    ////////////////////--product--///////////////////////////////////

     const {value}   = await Storage.get({ key : 'authData'})  ; 
    const authDictionary = JSON.parse(value);
    
     this.isLoading = true;
     this.postservice.fetchProducts(authDictionary.token).subscribe( data => {
      this.isLoading = false;
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
                  this.isLoading = false;
              } else  {
                let b = this.loadedProducts.filter(b => b.id !== this.loadedProducts[key].id);

                this.loadedProducts = b;
                this.isLoading = false;
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
                this.isLoading = false;
              } else {
                //console.log('its not here', this.loadingPosts[key]);
                // this.listedLoadedPosts.push(this.loadingPosts[key]);
                this.loadedProducts.unshift(this.loadingProduct[key]);
                this.isLoading = false;
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






     this.postservice.fetchUserPosts(authDictionary.token).subscribe(data => {
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
              if (itshere) {
              } else  {
                  this.loadedUserPosts.push(postData[key]);
              }
            }
          }

        }

      });
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
       if(this.loadedProducts.length > 0) {
        this.userHasLoadedItem = true;
        
      } else if (this.loadedProducts.length <= 0) {
        this.userHasLoadedItem = false;
      }
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


  onOpenListingDetails(post) {
    this.routes.navigateByUrl(`board/discover/post-detail/${post.id}`);
  }








}
