import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from './../post.service';
import { Post } from './../post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  private postSub: Subscription;
  isLoading = false;
  loadedOffers: Post[];


  constructor(private postservice: PostService,
              private route: ActivatedRoute,
              private routes: Router
              ) { }

  ngOnInit() {
    this.postSub = this.postservice.posts.subscribe(resData => {
      this.loadedOffers = resData;
    });
  }

  ionViewWillEnter(){
     this.isLoading = true;
     this.postservice.fetchPosts().subscribe(() => {
       this.isLoading = false;
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

}
