import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { ActionSheetController, PopoverController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.page.html',
  styleUrls: ['./message-detail.page.scss'],
})
export class MessageDetailPage implements OnInit {

  roomsMessages;
  topAvatar;
  currentUsername;
  currentUserId;
  refPost;
  roomId;
  msgRecipient;
  form: FormGroup;

  constructor(private messageService: MessageService,
              public actionSheetController: ActionSheetController,
              private authService: AuthService,
              public popoverCtrl: PopoverController,
              private router: Router,
              private route: ActivatedRoute,
              private navCtrl: NavController,
    ) { } 

  ngOnInit() {
    this.route.paramMap.subscribe(async paramMap => {
      console.log('this is the id',paramMap.get('roomId') );
      if (!paramMap.has('roomId')) {
        this.navCtrl.navigateBack('/messages');
        return;
      }

      (await this.messageService.fetchMessageDetail(paramMap.get('roomId'))).subscribe(resData => {
        this.roomsMessages = resData;
        console.log('msg', this.roomsMessages);
        console.log('this is room', this.roomsMessages[0].data.msg_data.recipient.id);
        
        this.msgRecipient = this.roomsMessages[0].data.msg_data.recipient.id;
        if (this.roomsMessages[0].data.sent) {

          this.topAvatar = this.roomsMessages[0].data.msg_data.recipient;
          this.msgRecipient = this.roomsMessages[0].data.msg_data.recipient.id;
          this.refPost = this.roomsMessages[0].data.msg_data.referenced_post.id;
          this.roomId = this.roomsMessages[0].data.msg_data.room.id;
          console.log('this is avatar', this.topAvatar);

        } else if (this.roomsMessages[0].data.received) {

          this.msgRecipient = this.roomsMessages[0].data.msg_data.sender.id;
          this.topAvatar = this.roomsMessages[0].data.msg_data.sender;
          this.refPost = this.roomsMessages[0].data.msg_data.referenced_post.id;
          this.roomId = this.roomsMessages[0].data.msg_data.room.id;
          console.log('this is avatar', this.topAvatar);
          
        }
      });
    });

    this.form = new FormGroup({
      message: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),

    });


  }


  async ionViewWillEnter(){
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const dicUsername = dic.username;
    this.currentUsername = dicUsername;
  }




  logScrollStart() {
    console.log('logScrollStart : When Scroll Starts');
  }

  logScrolling($event) {
    console.log('logScrolling : When Scrolling ', $event.detail.scrollTop);
    if ($event.detail.scrollTop === 0) {
      console.log('scroll reached to top');

    }
  }

  logScrollEnd() {
    console.log('logScrollEnd : When Scroll Ends');
  }





  sendMessage() {
    const data = new FormData();
    data.append('message', this.form.value.message);
    data.append('recipient', this.msgRecipient);
    data.append('id', this.roomId );
    data.append('referenced_post', this.refPost);

    this.messageService.sendExistMsgRoom(data).then(async () =>{
      (await this.messageService.fetchMessageDetail(this.roomId)).subscribe(resData => {
        this.roomsMessages = resData;
        console.log('msg', this.roomsMessages);
        console.log('this is room', this.roomsMessages[0].data.msg_data.recipient.id);
        
        this.msgRecipient = this.roomsMessages[0].data.msg_data.recipient.id;
        if (this.roomsMessages[0].data.sent) {

          this.topAvatar = this.roomsMessages[0].data.msg_data.recipient;
          this.msgRecipient = this.roomsMessages[0].data.msg_data.recipient.id;
          this.refPost = this.roomsMessages[0].data.msg_data.referenced_post.id;
          this.roomId = this.roomsMessages[0].data.msg_data.room.id;
          console.log('this is avatar', this.topAvatar);

        } else if (this.roomsMessages[0].data.received) {

          this.msgRecipient = this.roomsMessages[0].data.msg_data.sender.id;
          this.topAvatar = this.roomsMessages[0].data.msg_data.sender;
          this.refPost = this.roomsMessages[0].data.msg_data.referenced_post.id;
          this.roomId = this.roomsMessages[0].data.msg_data.room.id;
          console.log('this is avatar', this.topAvatar);
          
        }
      });
    });

  }
  


}
