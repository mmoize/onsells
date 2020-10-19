import { userProfileData } from './../../accounts/profile/userProfileData.model';
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
  @Input() userId;

  theImageString;
  profilesData;
  ownerImage

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
      this.theImageString = this.profilesData.image;
      console.log('user_post_iamge', this.selectedPost);
    } else if (this.selectedProfile) {
      this.theImageString = this.selectedProfile.image;
    } else if (this.userId) {
      //opening user-profile from chat-modal
     this.getUserFromChat(this.userId);
    }
    }

    async getUserFromChat(userid) {
      const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
      const dic = JSON.parse(value);
      const dicToken = dic.token;
      
      this.userListedSub = this.profileservice.UserProfileListings(userid , dicToken).subscribe(resData => {
        this.userListedPost = resData;
        console.log('for res listed', resData);
      });

      this.userListedSub = this.profileservice.loadUserProfile(userid).subscribe(resData => {
        console.log('Profile Data Results', resData);
        this.theImageString = resData.image;
        this.profilesData = resData;
      });


      setTimeout(async () => {
  
      const user = this.selectedPost.owner;
      const userID = user['id'];
      this.userListedSub = this.profileservice.UserProfileListings(userID , dicToken).subscribe(resData => {
        this.userListedPost = resData;
        console.log('for res listed', resData);
      });
    }, 1000);

    // opens the user's current listed items seg
      this.listedSeg = true;

  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  doRefresh(event) {



    setTimeout(() => {
      console.log('user_post', this.selectedPost);
      this.ownerImage = this.selectedPost.owner;
      this.theImageString = this.ownerImage.image;
      console.log('user_post_iamge', this.theImageString);
      event.target.complete();
    }, 2000);
  }

  onReturnToProfile() {
    this.modalCtrl.dismiss();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    if (this.userListedSub) {
      this.userListedSub.unsubscribe();
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
 