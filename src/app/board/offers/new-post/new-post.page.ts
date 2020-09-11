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
   this.loadingCtrl.create({keyboardClose: true, message: 'Create your Product'})
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
