import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { switchMap, take } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { AngularFirestore } from '@angular/fire/firestore';

export interface Video {
  title: string;
  url: string;
  thumb: string;
  subtitle: string;
}

// tslint:disable-next-line: class-name
export interface messageData {
  senderid: string;
  senderusername: string;
  content: string;
  timestamp?: Date;
}

// tslint:disable-next-line: class-name
export interface chatData {
  chatid: any;
  messages: Array<messageData>;
}

export interface onchatUser {
  userid: string;
  username: string;
  chatid: string;
  timestamp?: Date;
}

export interface User {
  userid: string;
  username: string;
  email: string;
  conversations?: Array<any>;
}



@Injectable({
  providedIn: 'root'
}) 
export class MessageService {



  constructor(private authService: AuthService,
              private afs: AngularFirestore,
              private httpService: HttpClient) { }

messagesUrl = 'https://sellet.herokuapp.com/api/lobby/';
messageRoomUrl = 'https://sellet.herokuapp.com/api/room/';
sendExistMsgRmUrl = 'https://sellet.herokuapp.com/api/postmessager/1';
createNewMessageUrl = 'https://sellet.herokuapp.com/api/postmessagex/1';

private videosList: Video[] = [
  {
    url: 'assets/Rotting Christ - 1275.mp4',
    subtitle: 'By Blender Foundation',
    thumb: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    title: 'Big Buck Bunny'
  },
  {
    url: 'assets/Flamingo - 49459.mp4',
    subtitle: 'By Blender Foundation',
    thumb: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    title: 'small Dream big play'
  },

  {
    url: 'assets/Bee - 39120.mp4',
    subtitle: 'By Blender Foundation',
    thumb: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    title: 'Elephant Dream'
  },
  {
    url: 'assets/Golden-48569.mp4',
    subtitle: 'By Blender Foundation',
    thumb: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    title: 'Big plays Bunny'
  },
  {
    url: 'assets/India - 1643.mp4',
    subtitle: 'By Blender Foundation',
    thumb: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    title: 'small Dream big play'
  },
  {
    url: 'assets/Rotting Christ - 1275.mp4',
    subtitle: 'By Blender Foundation',
    thumb: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    title: 'small Dream big play'
  },
  {
    url: 'assets/India - 1643.mp4',
    subtitle: 'By Blender Foundation',
    thumb: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    title: 'small Dream big play'
  },

]; 


private temp: any;
public currentUser: User;
public otherUser;
public messages = [];
public chat: chatData = {
  chatid: '',
  messages: []
 };
conversationId;


createUser(userId, data) {
  return this.afs.doc('chatUsers/' + userId).set({
    userid: userId,
    username: data.username,
    email: data.email,
    userdp: data.userdp,
    conversations: []
  });
}


updateUser(userId, data) {
  return this.afs.doc('chatUsers/' + userId).update(data);
}

getDisplayP(userId) {
  let data;
  this.afs.doc('chatUsers/' + userId).valueChanges().subscribe(resp => {
    data = resp['userdp'];

    console.log('this is currents', data);
  }, err => { console.log('error', err); });

  return data;
}


setCurrentUser(userId) {
  sessionStorage.setItem('userId', userId);
  console.log('service id', userId );
  this.afs.doc('chatUsers/' + userId).valueChanges().subscribe(resp => {
    this.temp = resp;
    this.currentUser =this.temp;
    console.log('this is current', this.temp);
  }, err => { console.log('error', err); });
}

getCurrentUser() {
  return this.afs.doc('chatUsers/' + sessionStorage.getItem('userId')).valueChanges();
}

public getUsers() {
  return this.afs.collection<any>('chatUsers').snapshotChanges();
}

getChat(chatid) {
  return this.afs.collection('conversations', ref => ref.where('chatid', '==', chatid)).valueChanges();
 }

 refreshCurrentUser(){
  this.afs.collection('chatUsers/' + sessionStorage.getItem('userId')).valueChanges().subscribe(data => {
       this.temp = data;
       this.currentUser = this.temp;
  });
}



async addChat(user) {
  // data to be added.
  const currentUserMsg = {username: user.username, userid: user.userid, chatid: this.chat.chatid};
  const otherMsg = {username: this.currentUser.username, userid: this.currentUser.userid, chatid: this.chat.chatid};
  // first set both references.
  const myReference = this.afs.doc('chatUsers/' + this.currentUser.userid);
  const otherReference = this.afs.doc('chatUsers/' + user.userid);

  myReference.get().subscribe(resData => {
    const capturedData = resData.data();
    console.log('capturedData', capturedData);
    if (!capturedData.conversations) {
      capturedData.conversations = [];
    }
    capturedData.conversations.push(currentUserMsg);
    return myReference.update({conversations: capturedData.conversations});
  });


  otherReference.get().subscribe(resData => {
    const capturedData = resData.data();
    console.log('capturedData', capturedData);
    if (!capturedData.conversations) {
      capturedData.conversations = [];
    }
    capturedData.conversations.push(otherMsg);
    return otherReference.update({conversations: capturedData.conversations});
  });

}

addNewChat() {
  const chatId = this.afs.createId();
  return this.afs.doc('conversations/' + chatId).set({
    chatid: chatId,
    messsages: []
  }).then(() => {
    this.chat = {
      chatid: chatId,
      messages: []
    };
  });
}


pushNewMessage(list) {
  console.log('this-chat-x-x-x-x-x-x-', this.chat);
  return this.afs.doc('conversations/' + this.chat.chatid).update(
    {messages: list}
  );
}


clearData() {
  sessionStorage.clear();
  this.messages = [];
  this.currentUser = {
    conversations: [],
    username: '',
    email : '',
    userid: '',
  };
  this.chat = null;
  this.temp = null;

}





public getVidoes(): Video[] {
  return this.videosList;
}


}
