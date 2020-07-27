import { NavController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from './../../post.service';
import { Post } from './../../post.model';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {
  isLoading = false;
  postId: string;
  private postSub: Subscription;
  post: Post;
  loadedPost: Post;
  form: FormGroup;

  constructor(
               private postservice: PostService,
               private activedrouter: ActivatedRoute,
               private navCtrl: NavController,
               private loadingctrl: LoadingController,
               private router: Router
              ) { }

  ngOnInit() {
    this.activedrouter.paramMap.subscribe(paramMap => {
      if (!paramMap.has('postId')) {
        this.navCtrl.navigateBack('/board/offers');
      }
      this.postId = paramMap.get('postId');
      this.isLoading = true;
      // this.postSub = this.postservice. // you are here... continue from here
    });
  }

}
