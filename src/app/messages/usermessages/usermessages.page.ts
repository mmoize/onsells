import { stringify } from 'querystring';
import { ProfileService } from './../../accounts/profile.service';
import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usermessages',
  templateUrl: './usermessages.page.html',
  styleUrls: ['./usermessages.page.scss'],
})
export class UsermessagesPage implements OnInit {

  email;
  username;
  userid;
  userdp;

  users = [];

  chatuserListTest=[];


  chatData = [{
    id: '12edd', name: 'Jovenica Alba',
    image: '../../assets/chat/chat1.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    count: '2',
    time: '12:17'
  }, {
    id: '12edd', name: 'Oliver',
    image: ' ../../assets/chat/chat2.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    time: '12:17'
  }, {
    id: '12edd', name: 'George',
    image: ' ../../assets/chat/chat3.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    count: '2',
    time: 'Yesterday'
  }, {
    id: '12edd', name: 'Harry',
    image: ' ../../assets/chat/chat4.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    time: 'Sunday'
  }, {
    id: '12edd', name: 'Jack',
    image: ' ../../assets/chat/chat5.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',

    time: '11:15'
  }, {
    id: '12edd', name: 'Jacob',
    image: ' ../../assets/chat/chat6.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    count: '1',
    time: 'Yesterday'
  }, {
    id: '12edd', name: 'Noah',
    image: ' ../../assets/chat/chat7.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    time: 'Monday'
  }, {
    id: '12edd', name: 'Charlie',
    image: ' ../../assets/chat/chat8.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    count: '6',
    time: '07:00'
  }, {
    id: '12edd', name: 'Logan',
    image: ' ../../assets/chat/chat1.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    time: 'Yesterday'
  }, {
    id: '12edd', name: 'Harrison',
    image: ' ../../assets/chat/chat2.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',

    time: 'Yesterday'
  }, {
    id: '12edd', name: 'Sebastian',
    image: ' ../../assets/chat/chat3.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',

    time: 'Yesterday'
  }, {
    id: '12edd', name: 'Zachary',
    image: ' ../../assets/chat/chat4.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    time: 'Today'
  }, {
    id: '12edd', name: 'Elijah',
    image: ' ../../assets/chat/chat5.jpg',
    // tslint:disable-next-line:max-line-length
    description: ' Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam sunt nulla minima ratione, pariatur quaerat aut ex a ullam? Officia, explicabo optio. Dolores, ab exercitationem? Neque illo soluta sapiente!',
    time: '18:25'
  }
  ];

  constructor(
              private profileService: ProfileService,
              private routes: Router,
              ) {

                this.setCurrentUserDetails();
                setTimeout(() => {

                  // Set firebase credentials.

                  const users = [];
                  firebase.firestore().collection('chatUsers').get().then(resData => {
                    resData.forEach(childData => {
                      users.push(childData.data());
                      if (childData.data()['userid'] != this.userid) {
                        users.push(childData.data());
                        this.users.push(childData.data());
                      }

                    });
                    this.chatuserListTest = users;

                    setTimeout(() => {
                      const checkRoleExistence = roleParam => this.chatuserListTest.some( data => data.userid === roleParam );
                      const onexist = checkRoleExistence(this.userid);
                      console.log('user does not exist', onexist);
                      console.log('user does not exist', this.chatuserListTest);
                      if (!onexist) {
                        console.log('user does not exist');
                        const ref = firebase.firestore().collection('chatUsers').doc(this.userid);
                        ref.set(
                          {userid: this.userid,
                          emai: this.email,
                          userdp: `${this.userdp}`,
                          username: this.username},
                          {merge: true}
                        );
                      }
                    }, 500);
               });
                  const docRef = firebase.firestore().collection("chats");
                  docRef.get().then((querySnapshot) => {
                    console.log('asssas11', querySnapshot);
                    querySnapshot.forEach((doc) => {
                      
                        console.log('asssas',doc);
                          // doc.data() is never undefined for query doc snapshots
                          
                        });
                    });


                  firebase.firestore().collection('chats').doc(this.userid).collection(this.userid).get().then(resData => {
                    
                    resData.forEach(childData => {
                        if (childData.data()['userid'] !== this.userid) {
                          // this.users.push(childData.data());
                          console.log('user moses1', childData.data()['userid']);
                        }
                        console.log('user moses2', childData.data());
                      });

                    console.log('user others moses', resData);
                  });

                 }, 1000);
              }

  async setCurrentUserDetails() {
    const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
    const userDicData = JSON.parse(value);

    this.email = userDicData.email;
    this.username = userDicData.username;
    this.userid = JSON.stringify(userDicData.user_id);

    this.profileService.loadUserProfile(this.userid).subscribe(res => {
      this.userdp = res.image;
      console.log('this is dp', res);
      console.log('this is dp', this.userdp);
    });
  }

  ngOnInit() {
  }


  checkRoleExistencePost(array:any) {

  }

  openChatDetail(userid, username) {
    sessionStorage.setItem('other_userid', userid);
    sessionStorage.setItem('other_username', username);
    sessionStorage.setItem('other_dp', this.userdp);
    this.routes.navigateByUrl('messages/chat');
  }

}
