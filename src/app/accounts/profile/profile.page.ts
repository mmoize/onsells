import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProfileService } from '../profile.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userId;

  imageString;

  userReceiptCal;

  @Output() userProfileData = new EventEmitter<string>();

  public userProfile;

  constructor(private profileservice: ProfileService,
              private authService: AuthService,
              private router: Router
              ) { }


  ngOnInit() {

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


}
