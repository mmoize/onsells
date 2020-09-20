import { HttpClient } from '@angular/common/http';
import { userProfileData } from './profile/userProfileData.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { Post } from '../board/post.model';

export interface ProfileData {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  country: string;
  city: string;
  bio: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private _posts = new BehaviorSubject<Post[]>([]);

  private _userProfileData = new BehaviorSubject<userProfileData>(null);
  userresultData;

  baseUrl = 'https://sellet.herokuapp.com/api/profiles/';
  profileEditUrl = 'https://sellet.herokuapp.com/api/user/';

  userProfileListingsUrl = 'https://sellet.herokuapp.com/api/getprofilepostlisting/';

  constructor(private http: HttpClient, ) { }
  
  loadUserProfile(id) {
    return this.http.get<ProfileData>(`${this.baseUrl}${id}`).pipe(tap(this.setProfile.bind(this)));

  }

  setProfile(profileData: ProfileData) {
    const rawData = JSON.stringify(profileData);
    const parseData = JSON.parse(rawData);
    const theUserID = parseData.profile.user_id;
    const theUsername = parseData.profile.username;
    const theFname = parseData.profile.f_name;
    const theLname = parseData.profile.l_name;
    const theCountry = parseData.profile.country;
    const theCity = parseData.profile.city;
    const theBio = parseData.profile.bio;
    const theimage = parseData.profile.image;
    const userProfile = new userProfileData (
       profileData.user_id = theUserID,
       profileData.username = theUsername,
       profileData.first_name = theFname,
       profileData.last_name = theLname,
       profileData.country = theCountry,
       profileData.city = theCity,
       profileData.bio = theBio,
       profileData.image = theimage

    );
    this._userProfileData.next(userProfile);
    this.userresultData = userProfile;
    this.storeUserProfileData(
      profileData.user_id,
      profileData.username,
      profileData.first_name,
      profileData.last_name,
      profileData.country,
      profileData.city,
      profileData.bio,
      profileData.image
      );
  }

  private storeUserProfileData(
    // tslint:disable-next-line: variable-name
    user_id: string,
    username: string,
    first_name: string,
    last_name: string,
    country: string,
    city: string,
    bio: string,
    image: string,

     ) {
       const data = JSON.stringify({user_id, username, first_name, last_name, country, city, bio, image});
       Plugins.Storage.set({key: 'userProfileData', value: data});
  }


  clearProfile() {
    this._userProfileData.next(null);
    Plugins.Storage.remove({key: 'userProfileData'});
  }

  UserProfileinfo(token, userData) {

    const data = userData;
    const xhr = new XMLHttpRequest();
    const url = this.profileEditUrl;
    xhr.open('PATCH', url, true);
    xhr.setRequestHeader( 'Authorization', 'Token ' + token );
    xhr.withCredentials = true;
    return xhr.send(data);

  }


  // async UserProfileListings(id) {

  //   const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
  //   const dic = JSON.parse(value);
  //   const dicToken = dic.token;
  //   console.log('for auth token', dicToken);
  
  //   return this.http.get(`${this.userProfileListingsUrl}${id}`, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       // tslint:disable-next-line: max-line-length
  //       Authorization: 'Token ' + dicToken ,
  //     }
  //   }).subscribe(resultData => {

  //     const posts = [];
  //     // tslint:disable-next-line: forin
  //     for (const key in resultData) {
  //       if (resultData.hasOwnProperty(key)) {
         
  //         posts.push(new Post (
  //             resultData[key].id,
  //             resultData[key].product,
  //             resultData[key].owner,
  //             resultData[key].location,
  //             resultData[key].created_at,
  //             resultData[key].updated_at,
  //             resultData[key].viewcount,
  //           )
  //         );
  //       }
  //     }
  //     return posts;
  //   });
  //  }

  
  UserProfileListings(id, token) {


  
    return this.http.get(`${this.userProfileListingsUrl}${id}`, {
      headers: {
        'Content-Type': 'application/json',
        // tslint:disable-next-line: max-line-length
        Authorization: 'Token ' + token ,
      }
    });
   }





}
