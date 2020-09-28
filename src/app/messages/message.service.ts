import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { switchMap, take } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

export declare interface User {
  token: string;
  apiKey: string;
  username: string;
}



@Injectable({
  providedIn: 'root'
}) 
export class MessageService {

  private _user: User;

  constructor(private authService: AuthService,
              private httpService: HttpClient) { }

messagesUrl = 'https://sellet.herokuapp.com/api/lobby/';
messageRoomUrl = 'https://sellet.herokuapp.com/api/room/';
sendExistMsgRmUrl = 'https://sellet.herokuapp.com/api/postmessager/1';
createNewMessageUrl = 'https://sellet.herokuapp.com/api/postmessagex/1';


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


  get user(): User {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
    console.log('this msgservice user', this._user);
  }


  


}
