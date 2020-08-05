import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'src/app/messages/message.service';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss'],
})
export class NewMessageComponent implements OnInit {
  roomsMessages;
  topAvatar;
  seletedProfile;
  image_string; 
  imagestring;
  currentUsername;
  currentUserId;
  refPost;
  roomId;
  msgRecipient;
  form: FormGroup;


  constructor(private modalCtrl: ModalController,
              private messageService: MessageService,
              ) { }

  ngOnInit() {
    if (this.seletedProfile) {
      console.log('user_post', this.seletedProfile);
      this.image_string = this.seletedProfile.owner;
      this.imagestring = this.image_string.image;
      this.topAvatar = this.image_string;
      console.log('user_post_iamge', this.seletedProfile);
      this.refPost = this.seletedProfile.id;
    }

    this.form = new FormGroup({
      message: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),

    });
  }

  onReturnToProfile() {
    this.modalCtrl.dismiss();
  }

  
  sendMessage() {
    const data = new FormData();
    data.append('message', this.form.value.message);
    console.log('this')
    data.append('recipient', this.topAvatar.id);
    data.append('referenced_post', this.refPost);
    this.messageService.createNewMessage(data).then( async () => {
      // (await this.messageService.fetchMessageDetail(this.roomId)).subscribe(resData => {
      //   this.roomsMessages = resData;
      //   console.log('msg', this.roomsMessages);
      //   console.log('this is room', this.roomsMessages[0].data.msg_data.recipient.id);
        
      //   this.msgRecipient = this.roomsMessages[0].data.msg_data.recipient.id;
      //   if (this.roomsMessages[0].data.sent) {

      //     this.topAvatar = this.roomsMessages[0].data.msg_data.recipient;
      //     this.msgRecipient = this.roomsMessages[0].data.msg_data.recipient.id;
      //     this.refPost = this.roomsMessages[0].data.msg_data.referenced_post.id;
      //     this.roomId = this.roomsMessages[0].data.msg_data.room.id;
      //     console.log('this is avatar', this.topAvatar);

      //   } else if (this.roomsMessages[0].data.received) {

      //     this.msgRecipient = this.roomsMessages[0].data.msg_data.sender.id;
      //     this.topAvatar = this.roomsMessages[0].data.msg_data.sender;
      //     this.refPost = this.roomsMessages[0].data.msg_data.referenced_post.id;
      //     this.roomId = this.roomsMessages[0].data.msg_data.room.id;
      //     console.log('this is avatar', this.topAvatar);
          
      //   }
      // });
    });
  }

}
