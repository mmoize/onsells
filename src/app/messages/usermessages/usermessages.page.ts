import { MessageService } from 'src/app/messages/message.service';
import { stringify } from 'querystring';
import { ProfileService } from './../../accounts/profile.service';
import { Component, OnInit, AfterViewInit, QueryList, ViewChildren, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Plugins } from '@capacitor/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, timeout } from 'rxjs/operators';
import { constants } from 'perf_hooks';
import { NgControlStatus } from '@angular/forms';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { VideoOptions, VideoPlayer } from '@ionic-native/video-player/ngx';

//import * as PluginsLibrary from 'capacitor-video-player';
import * as PluginsLibrary from '@jeepq/capacitor';
import { BehaviorSubject, empty, interval, Observable, Subscription } from 'rxjs';
const { CapacitorVideoPlayer, Device } = Plugins;



export interface Video {
  title: string;
  url: string;
  thumb: string;
  subtitle: string;
}

@Component({
  selector: 'app-usermessages',
  templateUrl: './usermessages.page.html',
  styleUrls: ['./usermessages.page.scss'],
})
export class UsermessagesPage implements OnInit, AfterViewInit {

  @ViewChildren('player')videoPlayers: QueryList<any>;
  videos;
  videoPlayer: any;
  currentlyPlaying = null;
  stickyVideo: HTMLVideoElement = null;

  initialLoading = false;

  stickyPlaying = false;
  @ViewChild('stickyplayer', {static: false}) stickyPlayer: ElementRef;
  mySubscription: Subscription;

  email;
  username;
  userid;
  userdp;

  testUsers = [];

  chatuserListTest = [];
  chatuserList;


  imgString = [];
  private msgs = new BehaviorSubject([]);

  title: string = 'fleeks';

  showFiller: boolean = false; // sidebar -toggler
  users: Array<any>; // users list.
  public messages: Array<any> = [] // messages array/
  temp: any; // for handling temporory data from observables.
  showMessages = false; // Toggle to select a conversation.
  message: string = ''; // the  message to be sent

  userFilter =  { username: ''};

  showChat = true;






  constructor(
              private profileService: ProfileService,
              public msgService: MessageService,
              private videoPlay: VideoPlayer,
              private renderer: Renderer2,
              // private _scrollToService: ScrollToService,
              private afs: AngularFirestore,
              private routes: Router,
              ) {

                this.videos = this.msgService.getVidoes();

                this.setCurrentUserDetails();
                setTimeout(() => {

                  // Set firebase credentials.

                  const users = [];
                  firebase.firestore().collection('chatUsers').get().then(resData => {
                    resData.forEach(childData => {
                      users.push(childData.data());
                      if (childData.data()['userid'] != this.userid) {
                        users.push(childData.data());
                        this.testUsers.push(childData.data());
                      }

                    });
                    this.chatuserListTest = users;


                    const checkRoleExistence = roleParam => this.chatuserListTest.some( data => data.userid === roleParam );
                    const onexist = checkRoleExistence(this.userid);
                    console.log(' does user exist', onexist);
                    setTimeout(() => {
                      if (!onexist) {
                        // tslint:disable-next-line: no-unused-expression
                        this.msgService.createUser(
                          this.userid,
                        {'username': this.username,
                         'email': this.email,
                         'userid': this.userid,
                         'userdp': this.userdp,
                        'conversations': []}
                          ).then(() => {
                            // do nothing for now..
                          });
                      } else {
                        this.getCurrentUserChats();
                      }
                    }, 500);

                  });

                  this.mySubscription= interval(5000).subscribe((x => {
                    this.getUpdatedDp();
                    console.log('it happened');
                }));

                }, 1000);


              }

 ionViewDidLeave(){
   this.mySubscription.unsubscribe();
 }             

  // Loads current user information
  async setCurrentUserDetails() {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const userDicData = JSON.parse(value);

    this.email = userDicData.email;
    this.username = userDicData.username;
    this.userid = JSON.stringify(userDicData.user_id);


    this.profileService.loadUserProfile(this.userid).subscribe(res => {
      this.userdp = JSON.stringify(res.image);
    });

  }



ionViewDidLoad(){
 this.initialLoading = true;
}


  ngOnInit() {


  }

  onRefresh(id) {
    let usermsg = this.imgString.filter(user => user.userid !== id);
    console.log('thisis onref', this.imgString);
    return usermsg;
  }

  getUpdatedDp() {
   
   const getCurrentData = this.msgService.setCurrentUser(sessionStorage.getItem('userId'));
   setTimeout(() => {
    const convoData = this.msgService.currentUser.conversations;

    convoData.forEach(resData => {
     const data = [];
     data.push(resData)
     let usermsg = data.filter(user => user.userid !== this.userid);
     this.profileService.loadUserProfile(resData.userid).subscribe(res => {
       if (!this.initialLoading) {
        this.userdp = res.image;
        resData['userdp'] = this.userdp;
       } else {
         // do thing here
       }
  
       const checkRoleExistence = roleParam =>  this.imgString.some( data => data.userid === roleParam );
       const onexist = checkRoleExistence(resData.userid);

       if (!onexist) {
        console.log('res..', resData);
        this.imgString.push(resData);
      } else {
       console.log('res..1', resData);
       this.imgString.forEach(res => {
         res['content'] = resData.content;
       });
       
        // do nothing
      }


     });
 
    });

    console.log('this is incoming data', convoData);
    
  }, 500);


   

  }


 



  getCurrentUserChats() {
    this.msgService.setCurrentUser(this.userid); // setting up the uid in the service for easy access.
    this.msgService.getUsers().pipe(map(actions => {
      return actions.map(resData => {
        const data = resData.payload.doc.data();
        const id = resData.payload.doc.id;
        return {...data};
      });
    })
  ).subscribe(data => {
    this.msgService.currentUser.conversations.forEach((res) => {
      console.log('hi its them', res);
    } );
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
    this.getUpdatedDp();
  });
}


loadUsers(user) {
  if (this.msgService.currentUser.conversations === undefined) {
    this.msgService.currentUser.conversations = [];
  }

  const chats = [...this.msgService.currentUser.conversations];
  const find = chats.find(resItem => resItem.userid === user.userid);
  if (find) {
    this.msgService.getChat(find.chatid).subscribe(resData => {
      this.temp = resData;

      this.msgService.chat = this.temp[0];

      this.messages = this.msgService.chat.messages === undefined ? [] : this.msgService.chat.messages;
      this.showMessages = true;
      return;
    });
    this.routes.navigateByUrl('messages/chat');

  } else {
    this.msgService.addNewChat().then(async () => {
      let resEl = await this.msgService.addChat(user);
    });
    this.routes.navigateByUrl('messages/chat');
  }

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

    this.message = '';


    // this.messages.push(msg);
    // console.log('list', this.messages);
    // this.msgService.pushNewMessage(this.messages).then(() => {
    //   console.log('sent');
    // });


  }


  //Scroll to the bottom
  // public triggerScrollTo() {
  //   const config: ScrollToConfigOptions = {
  //     target: 'destination'
  //   };
  //   this._scrollToService.scrollTo(config);
  // }

  // Firebase Server Timestamp
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  openChatDetail(user) {

    const myReference = this.afs.doc('chatUsers/' + this.userid);
    const otherReference = this.afs.doc('chatUsers/' + user.userid);

    myReference.get().subscribe(resData => {
      const capturedData = resData.data();
      
      capturedData.conversations.forEach(element => {
        if ( element.chatid === user.chatid) {
          if (element.inbox) {
            element.viewed = true;
            element.onseen = new Date();


          } else if (!element.inbox) {
            element.viewed = true;
            element.onseen = new Date();
          }
          myReference.update({conversations: capturedData.conversations});
          console.log('capturedData mine', capturedData.conversations);
        }
      }); 
    });

    otherReference.get().subscribe(resData => {
      const capturedData = resData.data();
      
      capturedData.conversations.forEach(element => {
        if ( element.chatid === user.chatid) {
          if (element.inbox) {
            element.onseen = new Date();
            element.theyviewed = true;

          } else if (!element.inbox) {
            element.theyviewed = true;
            element.onseen = new Date();
          }
          otherReference.update({conversations: capturedData.conversations});
          console.log('capturedData other', capturedData.conversations);

        }
      }); 
    });

    sessionStorage.setItem('other_userid', user.userid);
    sessionStorage.setItem('other_username', user.username);
    sessionStorage.setItem('other_dp', this.userdp);
    this.routes.navigateByUrl('messages/chat');
  }

  async ngAfterViewInit() {
    const info = await Device.getInfo();
    if (info.platform === "ios" || info.platform === "android") {
      console.log('video url 1');
      this.videoPlayer = CapacitorVideoPlayer;
    } else {
      console.log('video url 2');
      this.videoPlayer = PluginsLibrary.CapacitorVideoPlayer;
    }
  }
  async play(url: string) {
    console.log('video url', url);
    document.
    addEventListener('jeepCapVideoPlayerPlay', (e: CustomEvent) => { console.log('Event jeepCapVideoPlayerPlay ', e.detail) }, false);
    document.
    addEventListener('jeepCapVideoPlayerPause', (e: CustomEvent) => { console.log('Event jeepCapVideoPlayerPause ', e.detail) }, false);
    document.
    addEventListener('jeepCapVideoPlayerEnded', (e: CustomEvent) => { console.log('Event jeepCapVideoPlayerEnded ', e.detail) }, false);
    const res: any = await this.videoPlayer.initPlayer({ mode: 'embedded', url: url, playerId:"fullscreen" });
    console.log('video url', res);
  }

  openFullScreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitEnterFullscreen) {
      elem.webkitEnterFullscreen();
      elem.enterFullscreen();
    }
  }


  didScroll() {
    if (this.currentlyPlaying && this.isElementInViewport(this.currentlyPlaying)) {
      return;
    } else if (this.currentlyPlaying && !this.isElementInViewport(this.currentlyPlaying)) {
      // item is out of view, paused it
      this.currentlyPlaying.pause();
      this.currentlyPlaying = null;
    }

    this.videoPlayers.forEach( player => {
      console.log('this isplay', player);

      if (this.currentlyPlaying) {
        return;
      }

      const nativeElement = player.nativeElement;
      const inView = this.isElementInViewport(nativeElement);
      
      if (this.stickyVideo && this.stickyVideo.src == nativeElement.src) {
        return;
      }

      if (inView) {
        this.currentlyPlaying = nativeElement;
        this.currentlyPlaying.muted = true;
        this.currentlyPlaying.play();
        //this.currentlyPlaying.loop();
      }
    });
  }


isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientHeight)
  );
}


playOnSide(elem) {
  console.log('this is player', elem);
  if (this.stickyVideo) {
    this.renderer.removeChild(this.stickyPlayer.nativeElement, this.stickyVideo);
  }

  this.stickyVideo = elem.cloneNode(true);

  this.renderer.appendChild(this.stickyPlayer.nativeElement, this.stickyVideo);

  if (this.currentlyPlaying) {
    const playPosition = this.currentlyPlaying.currentTime;
    this.currentlyPlaying.pause();
    this.currentlyPlaying = null;
    this.stickyVideo.currentTime = playPosition;
  }

  this.stickyVideo.muted = false;
  this.stickyVideo.play();
  this.stickyPlaying = true;
}

closeSticky() {
  if (this.stickyVideo) {
    this.renderer.removeChild(this.stickyPlayer.nativeElement, this.stickyVideo);
    this.stickyVideo = null;
    this.stickyPlaying = false;
  }
}


playOrPauseSticky() {
  if (this.stickyPlaying) {
    this.stickyVideo.pause();
    this.stickyPlaying = false;
  } else {
    this.stickyVideo.play();
    this.stickyPlaying = true;
  }
}




}
