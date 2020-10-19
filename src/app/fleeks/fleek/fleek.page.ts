import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { ProfileService } from 'src/app/accounts/profile.service';


interface fleeksData {
  id: string;
  user: string;
  title: string;
  price: string;
  description: string;
  slug: string;
  created: string;

}

@Component({
  selector: 'app-fleek',
  templateUrl: './fleek.page.html',
  styleUrls: ['./fleek.page.scss'],
})
export class FleekPage implements OnInit, AfterViewInit {

  userdp
  email;
  username;
  userid;


  fleeks;

  public demoFleek = [
    {
      Id: '1',
      userName: 'Luff',
      userImgUrl: 'assets/img/popular3.png',
      description: 'Hey, that\'s an awesome chat UI',
      status: 'success'

    },
    {
      Id: '1',
      userName: 'Luff',
      userImgUrl: 'assets/img/Drone2.jpg',
      description: 'Hey, that\'s an awesome chat UI',
      status: 'success'

    },
    {
      Id: '1',
      userName: 'Luff',
      userImgUrl: 'assets/img/popular3.png',
      description: 'Hey, that\'s an awesome chat UI',
      status: 'success'

    },
    {
      Id: '1',
      userName: 'Luff',
      userImgUrl: 'assets/img/Drone2.jpg',
      description: 'Hey, that\'s an awesome chat UI',
      status: 'success'

    },
    {
      Id: '1',
      userName: 'Luff',
      userImgUrl: 'assets/img/popular3.png',
      description: 'Hey, that\'s an awesome chat UI',
      status: 'success'

    },
    {
      Id: '1',
      userName: 'Luff',
      userImgUrl: 'assets/img/Drone2.jpg',
      description: 'Hey, that\'s an awesome chat UI',
      status: 'success'

    },
  ];


  constructor(
    private profileservice: ProfileService,
    private routes: Router,
  ) { 
    // Sets the fleeks page current user
    this.setCurrentUserDetails();
  }

  ngOnInit() {

  }

 ngAfterViewInit() {
  this.fleeks = this.demoFleek;
  console.log(this.fleeks);
}


async setCurrentUserDetails() {
  const { value } = await Plugins.Storage.get({ key : 'authData'}) ;
  const userDicData = JSON.parse(value);

  this.email = userDicData.email;
  this.username = userDicData.username;
  this.userid = JSON.stringify(userDicData.user_id);


  this.profileservice.loadUserProfile(this.userid).subscribe(res => {
    this.userdp = res.image;
    console.log('this is img', this.userdp);
  });

}

openMarketplace(id) {
  this.routes.navigateByUrl(`/board/discover`);
}



}
