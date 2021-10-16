import { userProfileData } from '../../models/userProfileData.model';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { ProfileService } from './../../accounts/profile.service';

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IonSlide, ModalController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';

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
  @Input() fromRelationData;

  currentUser;

  theImageString;
  profilesData;
  ownerImage;

  is_following;
  changedRelationship = false;
  isFollowing = false;
  isUnFollowing = false;

  listedSeg = false;
  fleekSeg = false;
  mapSeg = false;

  followingSeg = false;
  followersSeg = false;

  loadedFollowers;
  loadedFollowing;


  userListedPost;
  private userListedSub: Subscription;


  constructor(private modalCtrl: ModalController,
              private routes: Router,
              private profileservice: ProfileService) 
              { 
                this.listedSeg = true;
              }

  async ngOnInit() {

     const {value}   = await Storage.get({ key : 'authData'})  ; 
    const authDictionary = JSON.parse(value);

    this.currentUser = authDictionary;

    console.log("profile authData",value)
    
    const userId = authDictionary.user_id

    if (this.selectedPost) {

      const username = this.selectedPost.owner['username'];
      const userId = this.selectedPost.owner['id'];
      this.profilesData = this.selectedPost.owner;
      this.theImageString = this.profilesData.image;

      this.userListedSub = this.profileservice.UserProfileListings(userId, username).subscribe(resData => {
        this.userListedPost = resData;
        console.log('for res listed', resData);
      });

      this.profileservice.loadUserProfile1(authDictionary.token, username).subscribe(resData => {
        this.is_following = resData.is_following;
        if (this.is_following) {
          this.isUnFollowing = true;
        } else if (!this.is_following) {
          this.isFollowing = true;
        }
        this.loadedFollowers = resData.followers;
        this.loadedFollowing = resData.following;
        this.theImageString = resData.image;
        console.log('selected post username', resData);
      });
      console.log('user_post_iamge', this.selectedPost);
    } else if (this.selectedProfile) {
      this.theImageString = this.selectedProfile.image;
    } else if (this.userId) {
     // opening user-profile from chat-modal
     this.getUserFromChat(this.userId);
     console.log('profile service id', this.userId);

    } else if (this.fromRelationData) {

      this.theImageString = this.fromRelationData.image;
      const relationUserId = this.fromRelationData.id;
      const relationUsername = this.fromRelationData.username;
      console.log('from relation', this.fromRelationData);

      this.userListedSub = this.profileservice.UserProfileListings(relationUserId, relationUsername).subscribe(resData => {
        this.userListedPost = resData;
        console.log('for res listed', resData);
      });

      this.profileservice.loadUserProfile1(authDictionary.token, this.fromRelationData.username).subscribe(resData => {
        this.is_following = resData.is_following;
        if (this.is_following) {
          this.isUnFollowing = true;
        } else if (!this.is_following) {
          this.isFollowing = true;
        }
        this.loadedFollowers = resData.followers;
        this.loadedFollowing = resData.following;
        this.profilesData = resData;
        this.theImageString = resData.image;
        console.log('this is new profile after', this.profilesData);
        console.log('this is new profile', this.loadedFollowers);

      });

    }
  
    }


    async reloadUser() {
       const {value}   = await Storage.get({ key : 'authData'})  ; 
      const authDictionary = JSON.parse(value);   
       
      this.profileservice.loadUserProfile1(authDictionary.token, this.fromRelationData.username).subscribe(resData => {
        this.is_following = resData.is_following;
        if (this.is_following) {
          this.isUnFollowing = true;
        } else if (!this.is_following) {
          this.isFollowing = true;
        }
        this.loadedFollowers = resData.followers;
        this.loadedFollowing = resData.following;
        this.profilesData = resData;
        this.theImageString = resData.image;
        console.log('this is new profile after', this.profilesData);
        console.log('this is new profile', this.loadedFollowers);

      });
    }


    async getUserFromChat(userid) {
       const {value}   = await Storage.get({ key : 'authData'})  ; 
      const authDictionary = JSON.parse(value); 
      
      this.userListedSub = this.profileservice.UserProfileListings(userid, authDictionary.username).subscribe(resData => {
        this.userListedPost = resData;
        console.log('for res listed', resData);
      });

      this.userListedSub = this.profileservice.loadUserProfile1(authDictionary.token, authDictionary.username).subscribe(resData => {
        console.log('Profile Data Results', resData);
        this.theImageString = resData.image;
        this.profilesData = resData;
      });


      setTimeout(async () => {
  
      const user = this.selectedPost.owner;
      const userID = user['id'];
      this.userListedSub = this.profileservice.UserProfileListings(userID , authDictionary.token).subscribe(resData => {
        this.userListedPost = resData;
        console.log('for res listed', resData);
      });
    }, 1000);

    // opens the user's current listed items seg
      this.listedSeg = true;

  }

 async onFollowUser() {
   if (this.isFollowing === true) {

     this.isUnFollowing = true;
     this.isFollowing = false;
     this.reloadUser();
   } else if (this.isFollowing === false) {
     this.reloadUser();
     this.isFollowing = true;
     this.isUnFollowing = false;
   }
   const { value } = await Storage.get({ key : 'authData'}) ;
   const dic = JSON.parse(value);
   const dicData = dic;
   const token = dicData.token;

   const info = new FormData();
   info.append('action', 'follow');
  // info.append('username', this.profilesData.username);
   this.profileservice.UserFollowRelationship(token, info, this.profilesData.username);

 }

 async unFollowUser() {

  if (this.isUnFollowing === true) {
    this.isUnFollowing = false;
    this.isFollowing = true;
    this.reloadUser();
  } else if (this.isUnFollowing === false) {
    this.reloadUser();
    this.isFollowing = false;
    this.isUnFollowing = true;
  }
  const { value } = await Storage.get({ key : 'authData'}) ;
  const dic = JSON.parse(value);
  const dicData = dic;
  const token = dicData.token;

  const info = new FormData();
  // info['action'] = 'unfollow';
  info.append('action', 'unfollow');
  // info.append('username', this.profilesData.username);
  this.profileservice.UserUnFollowRelationship(token, info, this.profilesData.username);

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
      this.followersSeg = true;
    }

  }

  onDetail(id) {
    this.routes.navigateByUrl(`/board/discover/post-detail/${id}`);
    this.modalCtrl.dismiss(null, 'cancel');
  }

  followersSegmentChanged(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'following') {
      this.followingSeg = true;
      this.followersSeg = false;
      
    }  else if (event.detail.value === 'followers') {
      console.log('its 2');
      this.followersSeg = true;
      this.followingSeg = false;
    } 
  }

  openModal(user) {
    this.modalCtrl.create({
      component:UserprofileComponent,
      componentProps: { fromRelationData: user}
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }


}
 