import { UserprofileComponent } from './../shared/userprofile/userprofile.component';
import { MessageService } from './message.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, PopoverController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { stringify } from 'querystring';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  messagesData;
  inbox = [];
  outbox = [];
  username;
  result_dic = [];
  result_dic_outbox = [];
  data_dic_outbox = [];
  myOutBox = [];
  refPost;
  msgloadEmpty = true;

  public userListArray: any = [];
  public userData: [];
  public refresh: any = 0;
  public unblockUserUID: any = '';
  private limit: any = 30;
  private usersRequest: any;

  constructor(private messageService: MessageService,
              public actionSheetController: ActionSheetController,
              private authService: AuthService,
              public popoverCtrl: PopoverController,
              private router: Router,
              private route: ActivatedRoute,
              private modalCtrl: ModalController,
              ) { }

  ngOnInit() {




  }

  ionViewDidLeave(){

  }


  async ionViewWillEnter() {

    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const dicUsername = dic.username;
    this.username = dicUsername;
    

    (await this.messageService.fetchMessages()).subscribe(resData => {

      if (this.msgloadEmpty) {
        this.messagesData = resData;
        this.messagesData.reverse();
        
        this.msgloadEmpty = false;
        for (const key in this.messagesData) {
          if (this.messagesData.hasOwnProperty(key)) {
            console.log('this is recipient username', this.messagesData[key].newest[0].recipient.username);
            console.log('this is sender username', this.messagesData[key].newest[0].sender.username);
            const msgSenderUsername = this.messagesData[key].newest[0].sender.username;
            const currentUsername = this.username;
            
            if (currentUsername === msgSenderUsername) {
              console.log('its a send true', msgSenderUsername);
              // tslint:disable-next-line: max-line-length
              this.inbox.push({'msg': this.messagesData[key], 'sent': true, 'recieved': false, 'avatar': this.messagesData[key].newest[0].recipient.image  });
            } else if (currentUsername !== msgSenderUsername) {
              console.log('its not a send ', msgSenderUsername);
              // tslint:disable-next-line: max-line-length
              this.inbox.push({'msg': this.messagesData[key], 'sent': false, 'recieved': true, 'avatar': this.messagesData[key].newest[0].recipient.image, 'unread': true });
            }
          }
        }
      }
      console.log( 'incoming data', resData);
      console.log('mesg', this.inbox);
    });
  }





  onClickDetail(id) {
    this.router.navigateByUrl(`/messages/message-detail/${id}`);
  }





}


    // // tslint:disable-next-line: forin
    // for (const key in this.messagesData) {

    //   console.log('this another key', key);
    //   if (this.messagesData.hasOwnProperty(key)) {

    //     const dicData = {
    //       message: this.messagesData[key].outbox,
    //       created: this.messagesData[key].created
    //     };
    //     console.log('yeah Outbox', dicData);
    //     this.data_dic_outbox.push(dicData);
    //   }

    //   if (this.messagesData.hasOwnProperty(key)) {

    //     const dicData = {
    //       message: this.messagesData[key].inbox,
    //       created: this.messagesData[key].created
    //     };
    //     this.data_dic.push(dicData);
    //   }

    // }

    // for (const key in this.data_dic) {
    //   if (this.data_dic.hasOwnProperty(key)) {
    //     if (this.data_dic[key].message === undefined) {
    //       console.log('this is not app of it', );
    //     } else {

    //       this.result_dic.push(this.data_dic[key]);
    //     }
    //   }
    // }
    // console.log('this is not ', this.result_dic );

    // for (const key in this.data_dic_outbox) {
    //   if (this.data_dic.hasOwnProperty(key)) {
    //     if (this.data_dic_outbox[key].message === undefined) {
    //       console.log('this is not app of outbox', );
    //     } else {

    //       this.result_dic_outbox.push(this.data_dic_outbox[key]);
    //     }
    //   }
    // }
    // console.log('this is not ', this.result_dic_outbox );


    // // tslint:disable-next-line: forin
    // for (const key in this. result_dic_outbox) {

    //   if (this.result_dic_outbox.hasOwnProperty(key)) {
    //     console.log('you are looking for this one', this.result_dic_outbox[key].message.referenced_post);

    //     if (this.result_dic_outbox[key].message.referenced_post in this.myOutBox ) {
    //       console.log('in there already');
    //     } else {

    //       this.myOutBox.push(this.result_dic_outbox[key].message.referenced_post);
    //     }

    //   }

    // }
    // console.log('last tings', this.myOutBox);
