import { PostService } from './../board/post.service';
import { BehaviorSubject, from } from 'rxjs';
import * as jwt_decode from 'jwt-decode';

import { environment } from './../../environments/environment';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { map, tap, timeout } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

export interface AuthResponseData {
  user_id: string;
  username: string;
  email: string;
  token: string;
  expiresIn: Date;
}
  


@Injectable({
  providedIn: 'root'
})
export class AuthService  implements OnDestroy {

 private _usertoken = new BehaviorSubject<User>(null);

  // tslint:disable-next-line: variable-name
  private _user = new BehaviorSubject<User>(null);


  // tslint:disable-next-line: variable-name
  private _userIsAuthenticated = false;
  // tslint:disable-next-line: variable-name
  private activeLogoutTimer: any;

  get UserId() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.user_id;
      } else {
        return null;
      }
    }));
  }
  get userName() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        console.log('this si username', user.username);
        return user.username;
      } else {
        return null;
      }
    }));
  }

  get userToken() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.token;
      } else {
        return null;
      }
    }));
  }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user => {
        if (user) {
          return  !!user.token;
        } else {
          return false;
        }

      })
    );
  }

  get userTok() {
    return this._user.asObservable().pipe(map(user => {
        if (user) {
          console.log('this  is user', user);
          return  user.token;
        } else {
          return null;
        }

      })
    );
  }

  get User_username() {
    return this._user.asObservable().pipe(map(userRes => {
      console.log(userRes);
      return userRes.username;
    }));
  }

  async returnUserId() {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dit = JSON.parse(value);
    const dat = dit.user_id;
    return dat;
  }

  async returnUsername() { 
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dit = JSON.parse(value);
    const dat = dit.username;
    return dat;
  }
   
 
  async returnUserToken() {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const dicToken = dic.token;
    console.log('for auth token', dicToken);
    
    return dicToken;
  }

  constructor(private http: HttpClient) { }

  autoLogin() {
    return from (Plugins.Storage.get({key: 'authData'}))
      .pipe(map(storedData => {
         if (!storedData || !storedData.value) {
           return null;
         }
         const parsedData = JSON .parse(storedData.value) as
         {user_Id: string; username: string;  email: string; token: string; tokenExpirationDate: string };
         const expirationTime = new Date(parsedData.tokenExpirationDate);
         if (expirationTime <= new Date()) {
           return null;
         }
         const user = new User(
          parsedData.user_Id,
          parsedData.username,
          parsedData.email,
          parsedData.token,
          expirationTime
         );
         return user;
      }),
      tap(user => {
        if (user) {
          
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  signup(email: string, password: string, username: string ) {
     return this.http.post<AuthResponseData>
     ('https://sellet.herokuapp.com/api/users/', { email, password, username }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
     return this.http.post<AuthResponseData>('https://sellet.herokuapp.com/api/users/login/', {email, password}
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({key: 'authData'});
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);
    if (decoded.exp === undefined) { return null; }
    const date  = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  getUserId(token: string) {
    const decoded = jwt_decode(token);
    const userId = decoded.id;
    return userId;
  }

  private setUserData(userData: AuthResponseData) {

    const oneToken = JSON.stringify(userData);
    const parsedToken = JSON.parse(oneToken);
    const theToken = parsedToken.user.token;
    const theUsername = parsedToken.user.username;
    const theEmail = parsedToken.user.email;
    const theUserId = this.getUserId(theToken);
    const tokenExpirationDate =  this.getTokenExpirationDate(theToken);
    const user = new User(
      userData.user_id = theUserId,
      userData.username = theUsername,
      userData.email = theEmail,
      userData.token = theToken,
      tokenExpirationDate,
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(userData.user_id, userData.username, userData.email, userData.token, tokenExpirationDate);
  }

  private storeAuthData(user_id: string, username: string, email: string, token: string, tokenExpirationDate: Date ) {
    const data = JSON.stringify({user_id, username, email, token, tokenExpirationDate });
    Plugins.Storage.set({key: 'authData', value: data});
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }


  onRequestPasswordReset(requestData) {
    const passReqUrl = 'https://sellet.herokuapp.com/api/password_reset/'
    

    const data = requestData;
    const xhr = new XMLHttpRequest();
    const url = passReqUrl;
    xhr.open('Post', url);
    return xhr.send(data);
  }

  onRequestNewPasswordReset(requestData) {
    const passReqUrl = 'https://sellet.herokuapp.com/api/password_reset/confirm/'
    
    const data = requestData;
    const xhr = new XMLHttpRequest();
    const url = passReqUrl;
    xhr.open('Post', url);
    return xhr.send(data);
  }


}
