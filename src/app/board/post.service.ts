import { switchMap, map, tap } from 'rxjs/operators';
import { Post } from './post.model';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { ProductLocation } from './location.model';

interface PostData{
  id: string;
  location: ProductLocation;
  owner: [];
  product: [];
  created: Date;
  updated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {


  private _posts = new BehaviorSubject<Post[]>([]);

  get posts() {
    return this._posts.asObservable();
  }

  constructor(private authService: AuthService,
              private httpService: HttpClient) { }

  postsUrl = 'https://sellet.herokuapp.com/api/viewpost/'

  fetchPosts() {
    return this.authService.userToken.pipe(switchMap(token => {
      return this.httpService.get<{[Key: string]: PostData}>(this.postsUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + token,
        }
      });

    })).pipe(map(resultData => {
      const posts = [];
      for (const key in resultData) {
        if (resultData.hasOwnProperty(key)) {
          posts.push(new Post (
              resultData[key].id,
              resultData[key].product,
              resultData[key].owner,
              resultData[key].location,
              resultData[key].created,
              resultData[key].updated
            )
          );
        }
      }
      return posts;
    }),
    tap(resData => {
      this._posts.next(resData);
    })
    );
  }

  
}
