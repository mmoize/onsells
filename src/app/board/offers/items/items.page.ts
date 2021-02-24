import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Post } from '../../post.model';
import { PostService } from '../../post.service';
import { Product } from '../../product.model';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
  userHasLoadedItem = true;
  
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



  constructor(
    private postservice: PostService,
    private routes: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
  ) {
      
   }


   ionViewWillEnter(){
    this.retrieveUserProducts();
   }



  ngOnInit() {

    this.prodSub = this.postservice.getProducts.subscribe(prodData => {

      // this.listedLoadedPosts = postData;
      // const checkRoleExistence = roleParam => this.listedLoadedPosts.some( data => data.id === roleParam );
      // console.log('second resultsaa', checkRoleExistence(postData[key].id));
      this.loadingProduct = prodData;
      if (!this.loaded) {
        this.loadedProducts = prodData;
        console.log('AAAAIIII', this.loadedProducts);
        this.loaded =true;
      } else {

        for (const key in this.loadedProducts) {
          if (this.loadedProducts.hasOwnProperty(key)) {
            const checkRoleExistence = roleParam => this.loadingProduct.some( data => data.id === roleParam );
            const itshere = checkRoleExistence(this.loadedProducts[key].id);

            if (itshere) {
   
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

  }


  async retrieveUserProducts() {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const dicToken = dic.token;
    this.postservice.fetchProducts(dicToken).subscribe( data => {
    });
  }



  onClickProdImage() {
    if (this.ClickedProdImage) {
      this.ClickedProdImage = false;
    } else {
      this.ClickedProdImage = true;
    }
  }


  onNewPostListing() {
    this.routes.navigateByUrl(`/board/offers/new-post`);
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



}
