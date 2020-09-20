import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { ProfileService } from './../../accounts/profile.service';
import { Post } from './../../board/post.model';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IonSlide, ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
})
export class UserprofileComponent implements OnInit {

  @ViewChild('mySlider') slider: IonSlide;
  @Input() selectedPost: Post;
  @Input() selectedProfile;

  imagestring;
  profilesData;

  listedSeg = false;
  fleekSeg = false;
  mapSeg = false;


  userListedPost;
  private userListedSub: Subscription;


  constructor(private modalCtrl: ModalController,
              private routes: Router,
              private profileservice: ProfileService) { }

  ngOnInit() {
    if (this.selectedPost) {
      console.log('user_post', this.selectedPost);
      this.profilesData = this.selectedPost.owner;
      this.imagestring = this.profilesData.image;
      console.log('user_post_iamge', this.selectedPost);
    } else if (this.selectedProfile) {
      this.imagestring = this.selectedProfile.image;
    }


    setTimeout(async () => {
      
      const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
      const dic = JSON.parse(value);
      const dicToken = dic.token;
      
      this.profileservice.UserProfileListings(this.selectedPost.owner.id, dicToken).subscribe(resData => {
        this.userListedPost = resData;
        console.log('for res listed', resData);
      });
    }, 1000);

  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  doRefresh(event) {



    setTimeout(() => {
      console.log('user_post', this.selectedPost);
      this.image_string = this.selectedPost.owner;
      this.imagestring = this.image_string.image;
      console.log('user_post_iamge', this.imagestring);
      event.target.complete();
    }, 2000);
  }

  onReturnToProfile() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    if (this.userListedPost) {
      this.userListedPost.unsubscribe();
    }
  }

  segmentChanged(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log('Segment changed', event);
    if (event.detail.value === 'listed') {
      console.log('its 1');
      this.listedSeg = true;
      this.fleekSeg = false;
      this.mapSeg = false;
    
    }  else if (event.detail.value === 'fleeks') {
      console.log('its 2');
      this.fleekSeg = true;
      this.listedSeg = false;
      this.mapSeg = false;
    } else if (event.detail.value === 'map') {
      console.log('its 3');
      this.fleekSeg = false;
      this.listedSeg = false;
      this.mapSeg = true;
    }

  }

  onDetail(id) {
    this.routes.navigateByUrl(`/board/discover/post-detail/${id}`);
    this.modalCtrl.dismiss(null, 'cancel');
  }

}
 