import { SuperTabsConfig } from '@ionic-super-tabs/core';
import { GroupsPage } from './../groups/groups.page';
import { FollowersPage } from './../followers/followers.page';
import { UsermessagesPage } from './../usermessages/usermessages.page';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../message.service';
import { ActionSheetController, PopoverController, NavController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { UserprofileComponent } from 'src/app/shared/userprofile/userprofile.component';


import { SuperTabs } from '@ionic-super-tabs/angular';


// declare const feather: any;

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.page.html',
  styleUrls: ['./message-detail.page.scss'],
})
export class MessageDetailPage implements OnInit {


  chats = [];
  textMsg;

//other's data
other_username;
other_userid;

//my data
userid

  

  constructor(private messageService: MessageService,
              public actionSheetController: ActionSheetController,
              private authService: AuthService,
              public popoverCtrl: PopoverController,
              private router: Router,
              private route: ActivatedRoute,
              private navCtrl: NavController,
              private modalCtrl: ModalController,

    ) { 
      this.other_username = sessionStorage.getItem('other_username');
      this.other_userid = sessionStorage.getItem('other_userid'); 
      // this.other_username = this.userid = JSON.stringify(sessionStorage.getItem('other_userid'));
      this.getUserData();

      setTimeout(() => {
        console.log('this is other', this.other_username);
        // firebase.firestore().collection('chats').doc(this.userid).collection(this.other_userid).orderBy('time')
        // .onSnapshot(snapRes => {
        //   console.log('this is other', snapRes);
        //   this.chats = []; // clears the chats array for replacations error.
        //   snapRes.forEach(child => {
        //      this.chats.push(child.data());
        //    });
        // });
      }, 1000);


    }


    async getUserData() {
      const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
      const userDicData = JSON.parse(value);
      const dicToken = userDicData.token;
      this.userid = JSON.stringify(userDicData.user_id);
    
    }


  async ngOnInit() {

  }

  send() {


    //my chats collection
    // firebase.firestore().collection('chats').doc(this.userid).collection(this.other_userid).add({
    //   time:Date.now(),
    //   userid: this.userid,
    //   msg: this.textMsg
    // });


    //other's chats collection
    // firebase.firestore().collection('chats').doc(this.other_userid).collection(this.userid).add({
    //   time:Date.now(),
    //   userid: this.userid,
    //   msg: this.textMsg
    // }).then(() => {
    //   this.textMsg = '';
    // });



  }


}
