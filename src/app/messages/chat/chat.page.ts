import { ProfileService } from './../../accounts/profile.service';
import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { ActionSheetController, IonContent, ModalController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Post } from 'src/app/board/post.model';
import { MessageService } from '../message.service';
import { map } from 'rxjs/operators';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { UserprofileComponent } from 'src/app/shared/userprofile/userprofile.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  email;
  username;
  userid;
  userdp;

  testUsers = [];

  chatuserListTest = [];


  title: string = 'fleeks';

  showFiller: boolean = false; //sidebar -toggler
  users: Array<any>; // users list.
  public messages: Array<any> = [] // messages array/
  temp: any; // for handling temporory data from observables.
  showMessages = false; //Toggle to select a conversation.
  message: string = ''; // the  message to be sent

  userFilter =  { username: ''};

  showChat = true; 
  private _scrollToService: ScrollToService;

  inModalmode = false;

  chats = [];
  textMsg;
  @Input() selectedpost: Post;

  // Others data
  otherUsername;
  otherUserId;
  otherUserDp;
  otherUser;



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

  

  ngOnInit() {
    console.log('other users dpaaaaaaaaa', this.selectedpost);
    const id = this.actRoute.snapshot.params.id;
    
    if (this.selectedpost) {
      this.inModalmode = true;
    }
  }

  constructor(private actRoute: ActivatedRoute,
              public actionSheetController: ActionSheetController,
              public msgService: MessageService,
              private modalCtrl: ModalController,
              private profileservice: ProfileService,
    ) {



    this.getCurrentUserData();
    this.otherUsername = sessionStorage.getItem('other_username');
    this.otherUserId = sessionStorage.getItem('other_userid');
    const otherUserData = {};
    otherUserData['userid'] = this.otherUserId;
    otherUserData['username'] = this.otherUsername;
    otherUserData['userdp'] = this.otherUserDp;
    this.otherUser = otherUserData;


    
    setTimeout(() => {
      this.profileservice.loadUserProfile(this.otherUserId).subscribe(resData => {
        console.log('this is other users profile', resData);
        this.otherUserDp = resData.image;
      });
      this.getCurrentUserChats();
    }, 400);

    setTimeout(() => {
      this.loadUsers(otherUserData);
    }, 900);

 
  }


  getCurrentUserChats() {
    console.log('imaaage', this.msgService.getDisplayP(this.userid));
    this.msgService.setCurrentUser(this.userid); //setting up the uid in the service for easy access.
    this.msgService.getUsers().pipe(map(actions => {
      return actions.map(resData => {
        const data = resData.payload.doc.data();
        const id = resData.payload.doc.id;
        return {...data};
      });
    })
  ).subscribe(data => {

    console.log('data',  this.msgService.currentUser.conversations );
    this.users = data.filter(item => {
      const find  = this.msgService.currentUser.conversations.find(resElement => resElement.userid === item.userid);
      console.log('data',  find  );
      console.log('data1',  item );
      if (!find) {
        return item;
      }
    });
    console.log('data users', this.users );
  });
}


  loadUsers(user) {
    console.log('this is resData chat', user);
    if (this.msgService.currentUser.conversations === undefined) {
      this.msgService.currentUser.conversations = [];
    }
  
    const chats = [...this.msgService.currentUser.conversations];
    const find = chats.find(resItem => resItem.userid === user.userid);
    console.log('this is resData find', find);
    if (find) {
      this.msgService.getChat(find.chatid).subscribe(resData => {
        this.temp = resData;
       
        this.msgService.chat = this.temp[0];
        console.log('this is resData chat', this.msgService.chat);

        this.messages = this.msgService.chat.messages === undefined ? [] : this.msgService.chat.messages;
        this.showMessages = true;
        console.log('this is resData chat', this.messages);
        setTimeout(() => {
          this.triggerScrollTo() //scroll to bottom
        }, 1000);
        return
      });
    } else {
      this.msgService.addNewChat().then(async () => {
        let resEl = await this.msgService.addChat(user);
      });
    }
  
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


  // ionViewDidLoad() {
  //   firebase.firestore().collection('currentChats').doc(this.userid).collection(this.otherUserId)
  //   .add({
  //     time: Date.now(),
  //     userid: this.userid,
  //     userdp: this.otherUserDp,
  //     username: this.otherUsername
  //   });
  // }


  // send() {



  //   const ref = firebase.firestore().collection('chats').doc(this.userid);
  //   ref.set(
  //     {userid: this.userid},
  //     {merge: true}
  //   );


  //   // my chats collection
  //   firebase.firestore().collection('chats').doc(this.userid).collection(this.otherUserId).add({
  //     time: Date.now(),
  //     userid: this.userid,
  //     msg: this.textMsg
  //   });


  //   // other's chats collection
  //   const otheRef = firebase.firestore().collection('chats').doc( this.otherUserId);
  //   otheRef.set(
  //     {userid: this.otherUserId},
  //     {merge: true}
  //   );

  //   firebase.firestore().collection('chats').doc(this.otherUserId).collection(this.userid).add({
  //     time: Date.now(),
  //     userid: this.userid,
  //     msg: this.textMsg
  //   }).then(() => {
  //     this.textMsg = '';
  //   });

  // }


  closeModal() {
    this.modalCtrl.dismiss();
  }

  sendMessage() {
    // If message string is empty
    if (this.message == '') {
      alert('Enter message');
      return;
    }

    const msg = {
      senderid: this.msgService.currentUser.userid,
      senderusername: this.msgService.currentUser.username,
      timestamp: new Date(),
      content: this.message
    };

    


    this.messages.push(msg);
    console.log('list', this.messages);
    this.msgService.pushNewMessage(this.messages, this.message, this.otherUserId).then(() => {
      console.log('sent ids', this.otherUserId);
      this.message = '';
    });


  }
  public triggerScrollTo() {
    const config: ScrollToConfigOptions = {
      target: 'destination'
    };
    this._scrollToService.scrollTo(config);
  }

  // Opens Other-Userprofile Modal
  openModal() {
    this.modalCtrl.create({
      component: UserprofileComponent,
      componentProps: {userId: this.otherUserId}
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });

  }


}
