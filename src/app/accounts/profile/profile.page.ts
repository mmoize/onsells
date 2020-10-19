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
      this.userListedSub = this.profileservice.UserProfileListings(userID , dicToken).subscribe(resData => {
        this.userListedPost = resData;
        console.log('for res listed', resData);
      });
    }, 1000);

  }

  doRefresh(event) {

    this.authService.returnUserId().then(resData => {
      this.userId = resData;
      const userid = resData;

      this.profileservice.loadUserProfile(userid).subscribe(resDatas => {
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
  ionViewWillEnter() {
    this.authService.returnUserId().then(resData => {
      this.userId = resData;
      const tin = resData;
      console.log('the issue', resData);
      this.profileservice.loadUserProfile(tin).subscribe(resDatas => {
        this.userProfile = resDatas;
        this.imageString = this.userProfile.image;
        this.userProfileData.emit(resData);
      });
    });

  }


  onclick() {
    this.router.navigateByUrl('/accounts/profile/profile-settings');
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
