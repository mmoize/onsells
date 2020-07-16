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

  constructor(private postservice: PostService,
              private authservice: AuthService
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

}
