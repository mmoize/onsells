import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
}) 
export class MessageService {

  constructor(private authService: AuthService,
              private httpService: HttpClient) { }

messagesUrl = 'https://sellet.herokuapp.com/api/lobby/';


fetchMessages() {

  return this.authService.userToken.pipe(switchMap(token => {
    console.log(token);
    return this.httpService.get(this.messagesUrl, {
      headers: {
        'Content-Type': 'application/json',
        // tslint:disable-next-line: max-line-length
        Authorization: 'Token ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwiZXhwIjoxNTk1ODE4NzMxfQ.udnrKfVLyIBxntW6d-cVvcTQsFXGbBem6KmbzkbeyB0'
        ,
      }
    });
  }));

}




}
