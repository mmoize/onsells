import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { switchMap, take } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';




@Injectable({
  providedIn: 'root'
}) 
export class MessageService {

  constructor(private authService: AuthService,
              private httpService: HttpClient) { }

messagesUrl = 'https://sellet.herokuapp.com/api/lobby/';
messageRoomUrl = 'https://sellet.herokuapp.com/api/room/';
sendExistMsgRmUrl = 'https://sellet.herokuapp.com/api/postmessager/1';


  fetchMessages() {

    return this.authService.returnUserToken().then(usertoken => {
      console.log('new tokens', usertoken);
      return this.httpService.get(this.messagesUrl, {
        headers: {
          'Content-Type': 'application/json',
          // tslint:disable-next-line: max-line-length
          Authorization: 'Token ' + usertoken
          ,
        }
      });
    });
}


  async fetchMessageDetail(id) {

    return this.authService.returnUserToken().then(usertoken => {
      console.log('new tokens', usertoken);
      return this.httpService.get(`${this.messageRoomUrl}${id}`, {
        headers: {
          'Content-Type': 'application/json',
          // tslint:disable-next-line: max-line-length
          Authorization: 'Token ' + usertoken
          ,
        }
      });
    });
  }

    

 sendExistMsgRoom(msgData) {

    return this.authService.returnUserToken().then(usertoken => {
      const xhr = new XMLHttpRequest();
      const url = this.sendExistMsgRmUrl;
      xhr.open('POST', url, true);
      xhr.setRequestHeader( 'Authorization', 'Token ' + usertoken);
      xhr.withCredentials = true;
      return xhr.send(msgData);
    });

  }


}
