import { ProfileService } from './../accounts/profile.service';
import { UserprofileComponent } from './../shared/userprofile/userprofile.component';
import { MessageService } from './message.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, PopoverController, ModalController, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { stringify } from 'querystring';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';

import { SuperTabs } from '@ionic-super-tabs/angular';
import { SuperTabsConfig } from '@ionic-super-tabs/core';
import { UsermessagesPage } from './usermessages/usermessages.page';
import { FollowersPage } from './followers/followers.page';
import { GroupsPage } from './groups/groups.page';



@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  tab1 = UsermessagesPage;
  tab2 = FollowersPage;
  tab3 = GroupsPage;
  searchbar = false;
  @ViewChild(SuperTabs) superTabs: SuperTabs;

  currentuserdp;

  opts = {
    icon: false,
    label: true,
    toolbarPos: 'bottom',
    scrollable: true,
  };

  config: SuperTabsConfig = {
    debug: true,
    allowElementScroll: false,
  };





  email;
  username;
  userid;
  users = [];


  constructor(
    private routes: Router,
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router,
    private storage: AngularFireStorage,
    private navCtrl: NavController,
    private profileservice: ProfileService,

  ) {

   this.getUserData();
   setTimeout(() => {

    // const ref = firebase.firestore().collection('chatUsers').doc(this.userid);
    // ref.set(
    //   {userid: this.userid,
    //   emai: this.email,
    //   username: this.username},
    //   {merge: true}
    // );



    firebase.firestore().collection('chatUsers').get().then(resData => {
         resData.forEach(childData => {
           if (childData.data()['userid'] != this.userid) {
             this.users.push(childData.data());
           }
         });
    });

  }, 1000);

  }





  // createUser() {

  //   firebase.firestore().collection('chatUsers').doc(this.userid).set({
  //     userid: this.userid,
  //     username: this.username,
  //     email: this.email
  //     })
  //     .then(() => {
  //         console.log('Document successfully written!');
  //       })
  //     .catch((error) => {
  //         console.error('Error writing document: ', error);
  //       });

  // }


  async getUserData() {
  const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
  const userDicData = JSON.parse(value);
  const dicToken = userDicData.token;
  this.email = userDicData.email;
  this.username = userDicData.username;
  this.userid = JSON.stringify(userDicData.user_id);

}



  ngOnInit() {
   console.log('this is userData', this.userid, this.username, this.email)    ;

  }


  openChatDetail(userid, username) {
    sessionStorage.setItem('other_userid', userid);
    sessionStorage.setItem('other_username', username);
    this.routes.navigateByUrl('messages/message-detail');
  }

  async ionViewWillEnter(){
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const userid = dic.user_id;
    this.profileservice.loadUserProfile(userid).subscribe(resData => {
        this.currentuserdp = resData.image;
     });
  }

  onCurrentUserProfile() {
    this.routes.navigateByUrl('/accounts/profile');
  }





}
