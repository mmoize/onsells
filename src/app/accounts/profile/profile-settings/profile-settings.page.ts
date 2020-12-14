import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileService } from '../../profile.service';
import { Router } from '@angular/router';
import { LoadingController, ActionSheetController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
})
export class ProfileSettingsPage implements OnInit {

  selectedImage;
  userProfile;
  imageString;
  postImage;
  postImageFormat;
  showImageAvatar = false;
  newImage = false;

  form: FormGroup;

  constructor(private profileservice: ProfileService,
              private authService: AuthService,
              private router: Router,
              private loadingCtrl: LoadingController,
              private actionSheetCtrl: ActionSheetController
               ) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      f_name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      l_name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      city: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      country: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      bio: new FormControl(null, {
        updateOn: 'blur',
        validators: []
      }),
      image: new FormControl(null)
    });
  }

  async ionViewWillEnter() {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const Token = dic.token;
    
    this.authService.returnUsername().then(resData => {
      const username = resData;
      console.log('the issue', resData);
      this.profileservice.loadUserProfile1(Token, username).subscribe(resDatas => {
        this.userProfile = resDatas;
        this.imageString = this.userProfile.image;
      });
    });
  }

  get formData() {
    const datas = new FormData();
  
    if ( this.form.value.username == null ) {
        datas.append('username', this.userProfile.username );
        // datas['username '] = this.userProfile.username;
      } else {
        datas.append('username', this.form.value.username );
        // datas['username'] = this.form.value.username;
      }
  
    if ( this.form.value.f_name == null ) {
        datas.append('f_name', this.userProfile.f_name);
        // datas['f_name '] = this.userProfile.f_name;
      } else {
        datas.append('f_name', this.form.value.f_name);
        // datas['f_name'] = this.form.value.f_name;
      }
  
    if ( this.form.value.l_name == null ) {
        datas.append('l_name ', this.userProfile.l_name);
        // datas['l_name '] = this.userProfile.l_name;
      } else {
        datas.append('l_name', this.form.value.l_name);
        // datas['l_name'] = this.form.value.l_name;
      }
    if ( this.form.value.city == null ) {
        datas.append('city', this.userProfile.city);
        // tslint:disable-next-line: no-string-literal
        // datas['city'] = this.userProfile.city;
      } else {
        datas.append('city', this.form.value.city);
        // datas['city'] = this.form.value.city;
      }
  
    if ( this.form.value.country == null ) {
        datas.append('country',  this.userProfile.country);
        // tslint:disable-next-line: no-string-literal
        // datas['country'] = this.userProfile.country;
      }  else {
        datas.append('country', this.form.value.country);
        // datas['country'] = this.form.value.country;
      }
    if ( this.form.value.bio == null ) {
        datas.append('bio', this.userProfile.bio);
        // datas['bio '] = this.userProfile.bio;
      } else {
        datas.append('bio', this.form.value.bio);
        // datas['bio'] = this.form.value.bio;
      }
    if (this.form.value.image == null) {
      // datas.append('image', this.imageString );  // `myAvatar.${this.postImageFormat}`
  
    } else {
      datas.append('image', this.form.value.image, `myAvatar.${this.postImageFormat}`);
    }
    console.log( 'thisii  ny mima', this.form.value.image);
    return datas;
  }

  onEdit() {

    this.authService.userToken.subscribe(token => {
      const tokens = token;
      this.loadingCtrl.create({
        keyboardClose: true,
        message: 'Updating Profile..'
      }).then(loadEl => {
        loadEl.present();
        this.profileservice.UserProfileinfo(token, this.formData);
        setTimeout(() => {
          loadEl.dismiss();
          this.router.navigateByUrl('/accounts/profile');
        }, 3000);
      });
    });
  }

  onReturnToProfile() {
    this.router.navigateByUrl('/accounts/profile');
  }


}
