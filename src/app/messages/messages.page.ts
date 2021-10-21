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
// import { AngularFireStorage } from '@angular/fire/storage';
// import * as firebase from 'firebase';

import { SuperTabs } from '@ionic-super-tabs/angular';
import { SuperTabsConfig } from '@ionic-super-tabs/core';
import { UsermessagesPage } from './usermessages/usermessages.page';
import { FollowersPage } from './followers/followers.page';
import { GroupsPage } from './groups/groups.page';
import { Storage } from '@capacitor/storage';



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

  currentUserData;

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
    // private storage: AngularFireStorage,
    private navCtrl: NavController,
    private profileservice: ProfileService,

  ) {


   setTimeout(() => {

    // firebase.firestore().collection('chatUsers').get().then(resData => {
    //      resData.forEach(childData => {
    //        if (childData.data()['userid'] != this.userid) {
    //          this.users.push(childData.data());
    //        }
    //      });
    // });

   }, 1000);



  }



  async ngOnInit() {
    const { value } = await Storage.get({ key : 'authData'}) ;
    const userDicData = JSON.parse(value);
  
    this.profileservice.loadUserProfile(userDicData.user_id).subscribe(resData => {
     this.currentUserData = resData;
    });
   }




  openChatDetail(userid, username) {
    sessionStorage.setItem('other_userid', userid);
    sessionStorage.setItem('other_username', username);
    this.routes.navigateByUrl('messages/message-detail');
  }


  onCurrentUserProfile() {
    this.routes.navigateByUrl('/accounts/profile');
  }





}
