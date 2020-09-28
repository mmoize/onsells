import { MessageDetailPage } from './../message-detail/message-detail.page';

import { ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, ActionSheetController } from '@ionic/angular';
import { SuperTabs } from '@ionic-super-tabs/angular';
import { SuperTabsConfig } from '@ionic-super-tabs/core';


@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.page.html',
  styleUrls: ['./create-message.page.scss'],
})
export class CreateMessagePage implements OnInit {
  tab1 = MessageDetailPage ;
  tab2 ;
  tab3 ;
  searchbar = false;
  @ViewChild(SuperTabs) superTabs: SuperTabs;
  opts = {
    icon: false,
    label: true,
    toolbarPos: 'top',
    scrollable: true,
  };

  config: SuperTabsConfig = {
    debug: true,
    allowElementScroll: false,
  };

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

  chatData = [{
    id: '12edd', name: 'Jovenica Alba',
    image: '../../assets/chat/chat1.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    count: '2',
    time: '12:17'
  }, {
    id: '12edd', name: 'Oliver',
    image: ' ../../assets/chat/chat2.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    time: '12:17'
  }, {
    id: '12edd', name: 'George',
    image: ' ../../assets/chat/chat3.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    count: '2',
    time: 'Yesterday'
  }, {
    id: '12edd', name: 'Harry',
    image: ' ../../assets/chat/chat4.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    time: 'Sunday'
  }, {
    id: '12edd', name: 'Jack',
    image: ' ../../assets/chat/chat5.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',

    time: '11:15'
  }, {
    id: '12edd', name: 'Jacob',
    image: ' ../../assets/chat/chat6.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    count: '1',
    time: 'Yesterday'
  }, {
    id: '12edd', name: 'Noah',
    image: ' ../../assets/chat/chat7.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    time: 'Monday'
  }, {
    id: '12edd', name: 'Charlie',
    image: ' ../../assets/chat/chat8.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    count: '6',
    time: '07:00'
  }, {
    id: '12edd', name: 'Logan',
    image: ' ../../assets/chat/chat1.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    time: 'Yesterday'
  }, {
    id: '12edd', name: 'Harrison',
    image: ' ../../assets/chat/chat2.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',

    time: 'Yesterday'
  }, {
    id: '12edd', name: 'Sebastian',
    image: ' ../../assets/chat/chat3.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',

    time: 'Yesterday'
  }, {
    id: '12edd', name: 'Zachary',
    image: ' ../../assets/chat/chat4.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    time: 'Today'
  }, {
    id: '12edd', name: 'Elijah',
    image: ' ../../assets/chat/chat5.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    time: '18:25'
  }
  ];

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


  constructor(private actRoute: ActivatedRoute, public actionSheetController: ActionSheetController) {
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

  // scrollToBottom() {
  //   this.content.scrollToBottom(100);
  // }

  // ionViewWillLeave() {
  //   this.events.unsubscribe('chat:received');
  // }

  // ionViewDidEnter() {
  //   console.log('scrollBottom');
  //   setTimeout(() => {
  //     this.scrollToBottom();
  //   }, 500);
  //   console.log('scrollBottom2');
  // }

  // logScrollStart() {
  //   console.log('logScrollStart');
  //   document.getElementById('chat-parent');
  // }

  // logScrolling(event) {
  //   console.log('event', event);
  // }


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

  ngOnInit() {
    const id = this.actRoute.snapshot.params.id;
  }

}
