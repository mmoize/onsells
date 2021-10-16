import { HttpClient } from '@angular/common/http';
import { userProfileData } from '../models/userProfileData.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { Storage } from '@capacitor/storage';


export interface ProfileData {
  user_id: string;
  username: string;
  first_name: string;
  followers: [];
  following: [];
  following_count: number;
  followers_count: number;
  last_name: string;
  is_following;
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

  baseUrl = 'https://fleekmarket.herokuapp.com/api/profiles/';
  profileEditUrl = 'https://fleekmarket.herokuapp.com/api/user/';
  
  fullProfileUrl = 'https://fleekmarket.herokuapp.com/api/core/';

  userProfileListingsUrl = 'https://fleekmarket.herokuapp.com/api/getprofilepostlisting/';

  constructor(private http: HttpClient, ) { }
  
  loadUserProfile1(token, userName) {
    return this.http.get<ProfileData>(`${this.fullProfileUrl}${userName}/`,  {
      headers: {
        'Content-Type': 'application/json',
        // tslint:disable-next-line: max-line-length
        Authorization: 'Token ' + token ,
      }
    }
    ).pipe(tap(this.setProfile.bind(this)));

  }

  loadUserProfile(id) {
    return this.http.get<ProfileData>(`${this.baseUrl}${id}`).pipe(tap(this.setProfile.bind(this)));
  }
  setProfile(profileData: ProfileData) {
    console.log('new dara', profileData);
    const rawData = JSON.stringify(profileData);
    const parseData = JSON.parse(rawData);
    const theUserID = parseData.user_id;
    const theUsername = parseData.username;
    const theFname = parseData.f_name;
    const theLname = parseData.l_name;
    const theCountry = parseData.country;
    const theCity = parseData.city;
    const theBio = parseData.bio;
    const theimage = parseData.image;
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
       localStorage.setItem('userProfileData', data);
  }


  clearProfile() {
    this._userProfileData.next(null);
    localStorage.removeItem('userProfileData');
    //Storage.remove({key: 'userProfileData'} || {});
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


  async currentUserProfileListings(id) {

     const {value}   = await Storage.get({ key : 'authData'})  ; 
    const authDictionary = JSON.parse(value);
    
    return this.http.get(`${this.userProfileListingsUrl}${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + authDictionary.Token ,
      }
    }).subscribe(resultData => {
      const posts = [];
      for (const key in resultData) {
        if (resultData.hasOwnProperty(key)) {
         
          posts.push(new Post (
              resultData[key].id,
              resultData[key].product,
              resultData[key].owner,
              resultData[key].location,
              resultData[key].created_at,
              resultData[key].updated_at,
              resultData[key].viewcount,
            )
          );
        }
      }
      console.log("user Profile listings", posts)
      return posts;
    });
   }

  
  UserProfileListings(id, token) {
    return this.http.get(`${this.userProfileListingsUrl}${id}`, {
      headers: {
        'Content-Type': 'application/json',
        // tslint:disable-next-line: max-line-length
        Authorization: 'Token ' + token ,
      }
    });
   }



    UserFollowRelationship(token, info, username) {

    const data = info;
    const xhr = new XMLHttpRequest();
    const url = `${this.fullProfileUrl}${username}/follow`;
    xhr.open('POST', url, true);
    // xhr.setRequestHeader( 'Content-Type', 'application/json' );
    xhr.setRequestHeader( 'Authorization', 'Token ' + token );
    xhr.withCredentials = true;
    return xhr.send(data);

  }
  UserUnFollowRelationship(token, info, username) {

    const data = info;
    console.log('content type', data);
    const xhr = new XMLHttpRequest();
    const url = `${this.fullProfileUrl}${username}/follow`;
    xhr.open('POST', url, true);
    // xhr.setRequestHeader( 'Content-Type', 'application/json' );
    xhr.setRequestHeader( 'Authorization', 'Token ' + token );
    xhr.withCredentials = true;
    return xhr.send(data);

  }


  getUserProfile(token, info) {
    const data = info;
    const xhr = new XMLHttpRequest();
    const url = `${this.fullProfileUrl}/${info.username}/`;
    xhr.open('GET', url, true);
    xhr.setRequestHeader( 'Authorization', 'Token ' + token );
    xhr.withCredentials = true;
    return xhr.send(data);
  }







}
