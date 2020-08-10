import { stringify } from 'querystring';
import { Product } from './product.model';


import { switchMap, map, tap, take } from 'rxjs/operators';
import { Post } from './post.model';
import { BehaviorSubject, async } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { ProductLocation } from './location.model';
import { Plugins } from '@capacitor/core';

interface PostData {
  id: string;
  location: ProductLocation;
  owner: [];
  product: [];
  // productimages: [];
  created_at: Date;
  updated_at: Date;
}

interface ProductData {
  id: string;
  user: [];
  title: string;
  price: string;
  description: string;
  category: string;
  barcode: string;
  slug: string;
  productimage_set: [];
  created: string;

}

@Injectable({
  providedIn: 'root'
})
export class PostService {

  get posts() {
    console.log('its main db', this._posts);
    return this._posts.asObservable();
    
  }

  constructor(private authService: AuthService,
              private httpService: HttpClient) { }

  get postRes() {
    return this._posts.asObservable().pipe(tap(resData => {
      console.log('post data', resData);
    }));
  }
  usertoken;

  private _userPosts = new BehaviorSubject<Post[]>([]);
  private _posts = new BehaviorSubject<Post[]>([]);
  private _products = new BehaviorSubject<Product[]>([]);

  postsUrl = 'https://sellet.herokuapp.com/api/viewpost/';
  postDetailUrl = 'https://sellet.herokuapp.com/api/postdetail/';
  postImageSetUrl = 'https://sellet.herokuapp.com/api/imageset/';
  userPostsUrl = 'https://sellet.herokuapp.com/api/userpostview/';
  userPostListingsUrl = 'https://sellet.herokuapp.com/api/postcreateview/1';

  productCreateUrl = 'https://sellet.herokuapp.com/api/products/';
  productsFetchUrl = 'https://sellet.herokuapp.com/api/userproductview/';
  productDeleteUrl = 'https://sellet.herokuapp.com/api/userdeleteproductview/';


  getPosts(id: string) {
  return this.fetchPosts().pipe( () => {
      return this._posts.asObservable().pipe(tap(resData => {
        console.log('post data', resData);
        return {...resData.find(p => p.id === id )};
      }));
    });

    
  }

  fetchPosts() {
    return this.authService.userToken.pipe(switchMap(token => {
      this.usertoken = token;
      return this.httpService.get<{[Key: string]: PostData}>(this.postsUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + token,
        }
      });

    })).pipe(map(resultData => {

      const posts = [];
      // tslint:disable-next-line: forin
      for (const key in resultData) {
        if (resultData.hasOwnProperty(key)) {
         
          posts.push(new Post (
              resultData[key].id,
              resultData[key].product,
              resultData[key].owner,
              resultData[key].location,
              resultData[key].created_at,
              resultData[key].updated_at
            )
          );
        }
      }
      return posts;
    }),
    tap(resData => {
      this._posts.next(resData);
      console.log('asa for post', this._posts);
    })
    );
  }

  async getPostDetail(id: string) {

    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const dicToken = dic.token;
    console.log('for auth token', dicToken);


    this.httpService.get(`${this.postImageSetUrl}${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + dicToken,
      }
    }).subscribe(resData => {
      console.log('all', resData);
    });


    return this.authService.userToken.pipe(switchMap(token => {
      console.log(token);
      return this.httpService.get<PostData>(`${this.postDetailUrl}${id}`, {
        headers: {
          'Content-Type': 'application/json',
          // tslint:disable-next-line: max-line-length
          Authorization: 'Token ' + dicToken ,
        }
      });
    })).pipe(map(postData => {
      console.log('this is original data', postData);
      return new Post(
        postData[0].id,
        postData[0].product,
        postData[0].owner,
        postData[0].location,
        postData[0].created_at,
        postData[0].updated_at
      );
    }));
  }


  async createPostListing(data) {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const dicToken = dic.token;
    console.log('for auth token', dicToken);

    const xhr = new XMLHttpRequest();
    const url = this.userPostListingsUrl ;
    xhr.open('POST', url, true);
    xhr.setRequestHeader( 'Authorization', 'Token ' + dicToken );
    xhr.withCredentials = true;
    return xhr.send(data);
  }



  fetchUserPosts(tokens) {

    return this.authService.userToken.pipe(switchMap(token => {
      console.log('this userpost', token);
      return this.httpService.get<{[Key: string]: PostData}>(this.userPostsUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + tokens,
        }
      });

    })).pipe(map(resultData => {

      const posts = [];
      // tslint:disable-next-line: forin
      for (const key in resultData) {
        if (resultData.hasOwnProperty(key)) {
         
          posts.push(new Post (
              resultData[key].id,
              resultData[key].product,
              resultData[key].owner,
              resultData[key].location,
              resultData[key].created_at,
              resultData[key].updated_at
            )
          );
        }
      }
      return posts;
    }),
    tap(resData => {
      this._userPosts.next(resData);
      console.log('userPost Data', this._userPosts);
    })
    );
  }

  get getUserPosts() {
    return this._userPosts.asObservable().pipe(tap(resData => {
      console.log('userPost  data', resData);
    }));
  }




  async createProductUpload(data) {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const dicToken = dic.token;
    console.log('for auth token', dicToken);

    const xhr = new XMLHttpRequest();
    const url = this.productCreateUrl;
    xhr.open('POST', url, true);
    xhr.setRequestHeader( 'Authorization', 'Token ' + dicToken );
    xhr.withCredentials = true;
    return xhr.send(data);
  }

 fetchProducts(token) {

    console.log('for auth token', );

    return  this.httpService.get<{[Key: string]: ProductData}>(this.productsFetchUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      }
    }).pipe(map(resultData => {

      const products = [];
      // tslint:disable-next-line: forin
      for (const key in resultData) {
        if (resultData.hasOwnProperty(key)) {
         
          products.push(new Product (
              resultData[key].id,
              resultData[key].user,
              resultData[key].title,
              resultData[key].price,
              resultData[key].description,
              resultData[key].category,
              resultData[key].barcode,
              resultData[key].slug,
              resultData[key].productimage_set,
              resultData[key].created

          ));
        }
      }
      console.log('asa for product', products);
      return products;
      
    }),
    tap(resData => {
      this._products.next(resData);
      console.log('asa for product', this._products);
    })
    );
  }

  get getProducts() {
    return this._products.asObservable().pipe(tap(resData => {
      console.log('product data', resData);
    }));
  }


 productDelete(id) {
   this.httpService.delete(`${this.productDeleteUrl}${id}`);
 }



}
