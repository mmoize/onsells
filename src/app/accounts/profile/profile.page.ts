import { SegmentChangeEventDetail } from '@ionic/core';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProfileService } from '../profile.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  listedSeg = false;
  fleekSeg = false;
  mapSeg = false;

  followingSeg = false;
  followersSeg = false;

  loadedFollowers;
  loadedFollowing;

  is_following;
  changedRelationship = false;
  isFollowing = false;
  isUnFollowing = false;

  userName;
  userId;

  imageString;

  userReceiptCal;

  @Output() userProfileData = new EventEmitter<string>();

  public userProfile;
  userListedPost;
  private userListedSub: Subscription;

  constructor(private profileservice: ProfileService,
              private authService: AuthService,
              private modalCtrl: ModalController,
              private routes: Router,
              private router: Router
              ) { }


  ngOnInit() {

    setTimeout(async () => {
      
      const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
      const dic = JSON.parse(value);
      const dicToken = dic.token;



      
      const userID = this.userId;
      this.userListedSub = this.profileservice.UserProfileListings(dic.user_id, dic.token).subscribe(resData => {
        this.userListedPost = resData;
        console.log('for res listed', resData);
      });
    }, 1000);

  }

  async doRefresh(event) {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const Token = dic.token;

    this.authService.returnUserId().then(resData => {
      this.userId = resData;
      const userid = resData;

      this.profileservice.loadUserProfile1(Token, this.userName).subscribe(resDatas => {
      this.userProfile = resDatas;
      this.imageString = this.userProfile.image;
      this.userProfileData.emit(resData);
      });
    });

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }


   //
  async ionViewWillEnter() {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const Token = dic.token;
    
    this.authService.returnUsername().then(resData => {
      this.userName = resData;


      this.profileservice.loadUserProfile1(Token, this.userName).subscribe(resDatas => {
        console.log('profile', resDatas);
        this.userProfile = resDatas;
        this.imageString = this.userProfile.image;
        this.userProfileData.emit(resData);
      });

      this.profileservice.loadUserProfile1(dic.token, dic.username).subscribe(resData => {
        this.is_following = resData.is_following;
        if (this.is_following) {
          this.isUnFollowing = true;
        } else if (!this.is_following) {
          this.isFollowing = true;
        }
        this.loadedFollowers = resData.followers;
        this.loadedFollowing = resData.following;

        console.log('selected post username', resData);
      });

    });

  }


  onclick() {
    this.router.navigateByUrl('/accounts/profile/profile-settings');
  }


  // segmentChanged(event: CustomEvent<SegmentChangeEventDetail>) {
  //   console.log('Segment changed', event);
  //   if (event.detail.value === 'listed') {
  //     console.log('its 1');
  //     this.listedSeg = true;
  //     this.fleekSeg = false;
  //     this.mapSeg = false;
    
  //   }  else if (event.detail.value === 'fleeks') {
  //     console.log('its 2');
  //     this.fleekSeg = true;
  //     this.listedSeg = false;
  //     this.mapSeg = false;
  //   } else if (event.detail.value === 'map') {
  //     console.log('its 3');
  //     this.fleekSeg = false;
  //     this.listedSeg = false;
  //     this.mapSeg = true;
  //   }

  // }

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



  onDetail(id) {
    this.routes.navigateByUrl(`/board/discover/post-detail/${id}`);
    this.modalCtrl.dismiss(null, 'cancel');
  }


}
