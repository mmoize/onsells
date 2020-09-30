import { ProfileService } from './../../accounts/profile.service';
import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { ActionSheetController, IonContent, ModalController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Post } from 'src/app/board/post.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  inModalmode = false;

  chats = [];
  textMsg;
  @Input() selectedpost: Post;

  // Others data
  otherUsername;
  otherUserId;
  otherUserDp;

  // currentUser data
  userid;

  @ViewChild('content') content: IonContent;
  @ViewChild('chat_input') messageInput: ElementRef;
  User = 'Me';
  toUser = 'driver';
  inpText: any;
  editorMsg = '';
  showEmojiPicker = false;
  msgList: Array<{
    userId: any,
    userName: any,
    userAvatar: any,
    time: any,
    message: any,
    upertext: any;
  }>;
  private events;
  public count = 0;
  public arr = [
    {
      messageId: '1',
      userId: '140000198202211138',
      userName: 'Luff',
      userImgUrl: './assets/user.jpg',
      toUserId: '210000198410281948',
      toUserName: 'Hancock',
      userAvatar: './assets/to-user.jpg',
      time: 1488349800000,
      message: 'Hey, that\'s an awesome chat UI',
      status: 'success'

    },
    {
      messageId: '2',
      userId: '210000198410281948',
      userName: 'Hancock',
      userImgUrl: './assets/to-user.jpg',
      toUserId: '140000198202211138',
      toUserName: 'Luff',
      userAvatar: './assets/user.jpg',
      time: 1491034800000,
      message: 'Right, it totally blew my mind. They have other great apps and designs too !',
      status: 'success'
    },
    {
      messageId: '3',
      userId: '140000198202211138',
      userName: 'Luff',
      userImgUrl: './assets/user.jpg',
      toUserId: '210000198410281948',
      toUserName: 'Hancock',
      userAvatar: './assets/to-user.jpg',
      time: 1491034920000,
      message: 'And it is free ?',
      status: 'success'
    },
    {
      messageId: '4',
      userId: '210000198410281948',
      userName: 'Hancock',
      userImgUrl: './assets/to-user.jpg',
      toUserId: '140000198202211138',
      toUserName: 'Luff',
      userAvatar: './assets/user.jpg',
      time: 1491036720000,
      message: 'Yes, totally free. Beat that ! ',
      status: 'success'
    },
    {
      messageId: '5',
      userId: '210000198410281948',
      userName: 'Hancock',
      userImgUrl: './assets/to-user.jpg',
      toUserId: '140000198202211138',
      toUserName: 'Luff',
      userAvatar: './assets/user.jpg',
      time: 1491108720000,
      message: 'Wow, that\'s so cool. Hats off to the developers. This is gooood stuff',
      status: 'success'
    },
    {
      messageId: '6',
      userId: '140000198202211138',
      userName: 'Luff',
      userImgUrl: './assets/user.jpg',
      toUserId: '210000198410281948',
      toUserName: 'Hancock',
      userAvatar: './assets/to-user.jpg',
      time: 1491231120000,
      message: 'Check out their other designs.',
      status: 'success'
    }
  ];


  ngOnInit() {
    console.log('other users dpaaaaaaaaa', this.selectedpost);
    const id = this.actRoute.snapshot.params.id;
    
    if (this.selectedpost) {
      this.inModalmode = true;
    }
  }

  constructor(private actRoute: ActivatedRoute,
              public actionSheetController: ActionSheetController,
              private modalCtrl: ModalController,
              private profileservice: ProfileService,
     ) {



    this.getCurrentUserData();
    this.otherUsername = sessionStorage.getItem('other_username');
    this.otherUserId = sessionStorage.getItem('other_userid');

    
    setTimeout(() => {
      this.profileservice.loadUserProfile(this.otherUserId).subscribe(resData => {
        console.log('this is other users profile', resData);
        this.otherUserDp = resData.image;
      });
    }, 500);

    setTimeout(() => {
      this.profileservice.loadUserProfile(this.userid).subscribe(resData => {
        console.log('this is other users profile', resData);
        const ref = firebase.firestore().collection('chatUsers').doc(resData.user_id);
        ref.set(
          {userid: resData.user_id,
          userdp: resData.image ,
          username: resData.username},
          {merge: true}
        );

      });
    }, 500);


    setTimeout(() => {
      firebase.firestore().collection('chats').doc(this.userid).collection(this.otherUserId).orderBy('time')
      .onSnapshot(snapRes => {

        this.chats = []; // clears the chats array for replacations error.
        snapRes.forEach(child => {
          console.log('this is snap', child.data());
           this.chats.push(child.data());
         });
      });
    }, 1000);

    this.msgList = [
      {
        userId: this.User,
        userName: this.User,
        userAvatar: 'assets/driver.jpeg',
        time: '12:01 pm',
        message: 'Hey, that\'s an awesome chat UI',
        upertext: 'Hello'
      },
      {
        userId: this.toUser,
        userName: this.toUser,
        userAvatar: 'assets/user.jpeg',
        time: '12:01 pm',
        message: 'Right, it totally blew my mind. They have other great apps and designs too!',
        upertext: 'Hii'
      },
      {
        userId: this.User,
        userName: this.User,
        userAvatar: 'assets/driver.jpeg',
        time: '12:01 pm',
        message: 'And it is free ?',
        upertext: 'How r u '
      },
      {
        userId: this.toUser,
        userName: this.toUser,
        userAvatar: 'assets/user.jpeg',
        time: '12:01 pm',
        message: 'Yes, totally free. Beat that !',
        upertext: 'good'
      },
      {
        userId: this.User,
        userName: this.User,
        userAvatar: 'assets/driver.jpeg',
        time: '12:01 pm',
        message: 'Wow, that\'s so cool. Hats off to the developers. This is gooood stuff',
        upertext: 'How r u '
      },
      {
        userId: this.toUser,
        userName: this.toUser,
        userAvatar: 'assets/user.jpeg',
        time: '12:01 pm',
        message: 'Check out their other designs.',
        upertext: 'good'
      },
      {
        userId: this.User,
        userName: this.User,
        userAvatar: 'assets/driver.jpeg',
        time: '12:01 pm',
        // tslint:disable-next-line:max-line-length
        message: 'Have you seen their other apps ? They have a collection of ready-made apps for developers. This makes my life so easy. I love it! ',
        upertext: 'How r u '
      },
      {
        userId: this.toUser,
        userName: this.toUser,
        userAvatar: 'assets/user.jpeg',
        time: '12:01 pm',
        message: 'Well, good things come in small package after all',
        upertext: 'good'
      },
    ];

  }

  async getCurrentUserData() {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const userDicData = JSON.parse(value);
    const dicToken = userDicData.token;
    this.userid = JSON.stringify(userDicData.user_id);

  }

  scrollToBottom() {
    this.content.scrollToBottom(100);
  }

  // ionViewWillLeave() {
  //   this.events.unsubscribe('chat:received');
  // }

  ionViewWillEnter(){
    this.profileservice.loadUserProfile(this.otherUserId).subscribe(resData => {
      console.log('this is other users profile', resData);
      this.otherUserDp = resData.image;
    });
  }

  ionViewDidEnter() {
    console.log('scrollBottom');
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
    console.log('scrollBottom2');
  }

  logScrollStart() {
    console.log('logScrollStart');
    document.getElementById('chat-parent');
  }

  logScrolling(event) {
    console.log('event', event);
  }


  async addFile() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Add a',
      buttons: [ {
        text: 'Picture',
        icon: 'image-sharp',
        handler: () => {
        }
      }, {
        text: 'Document',
        icon: 'document-text',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }


  ionViewDidLoad() {
    firebase.firestore().collection('currentChats').doc(this.userid).collection(this.otherUserId)
    .add({
      time: Date.now(),
      userid: this.userid,
      userdp: this.otherUserDp,
      username: this.otherUsername
    });
  }


  send() {



    const ref = firebase.firestore().collection('chats').doc(this.userid);
    ref.set(
      {userid: this.userid},
      {merge: true}
    );


    // my chats collection
    firebase.firestore().collection('chats').doc(this.userid).collection(this.otherUserId).add({
      time: Date.now(),
      userid: this.userid,
      msg: this.textMsg
    });


    // other's chats collection
    const otheRef = firebase.firestore().collection('chats').doc( this.otherUserId);
    otheRef.set(
      {userid: this.otherUserId},
      {merge: true}
    );

    firebase.firestore().collection('chats').doc(this.otherUserId).collection(this.userid).add({
      time: Date.now(),
      userid: this.userid,
      msg: this.textMsg
    }).then(() => {
      this.textMsg = '';
    });

  }


  closeModal() {
    this.modalCtrl.dismiss();
  }




}
