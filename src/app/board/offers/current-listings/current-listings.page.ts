import { SegmentChangeEventDetail } from '@ionic/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { AlertController, IonItemSliding, LoadingController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PostService } from '../../post.service';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-current-listings',
  templateUrl: './current-listings.page.html',
  styleUrls: ['./current-listings.page.scss'],
})
export class CurrentListingsPage implements OnInit {

  userHasLoadedItem = true;
  userHasLoadedListings = true;

  androidPlatform  = false;
  iosPlatform = false;
  desktopPlatform = false;
  
  

  private postSub: Subscription;
  private prodSub: Subscription;
  isLoading = false;
  loadedOffers: Post[];
  loadedUserPosts: Post[];
  userPostCount;
  loaded = false;

  gridLayout = true;
  itemsLayout = false;



  constructor(
    private postservice: PostService,
    private routes: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private platform: Platform,
  ) { 
    this.setCurrentPlatform();
  }

  private setCurrentPlatform() {
    // Are we on mobile platform? Yes if platform is ios or android, but not desktop or mobileweb, no otherwise
    if (this.platform.is('ios')) {
      this.iosPlatform = true;
      console.log('its ios');
    } else if ( this.platform.is('android')) {
      this.androidPlatform = true;
      console.log('its android');
    } else  {
      this.desktopPlatform = true;
      console.log('its desk');
    }
  }


  ionViewWillEnter(){
   this.retrieveUserPosts();

   this.postSub = this.postservice.getUserPosts.subscribe(postData => {

    // this.listedLoadedPosts = postData;
    // const checkRoleExistence = roleParam => this.listedLoadedPosts.some( data => data.id === roleParam );
    // console.log('second resultsaa', checkRoleExistence(postData[key].id));

    if (!this.loadedUserPosts) {
      this.loadedUserPosts = postData;
    } else {

      for (const key in postData) {
        if (postData.hasOwnProperty(key)) {
          const itshere = this.checkRoleExistencePost(postData[key].id);
          if (itshere) {
          } else  {
              this.loadedUserPosts.push(postData[key]);
          }
        }
      }

    }

  });
  }


  ngOnInit() {

    this.postSub = this.postservice.getUserPosts.subscribe(postData => {

      // this.listedLoadedPosts = postData;
      // const checkRoleExistence = roleParam => this.listedLoadedPosts.some( data => data.id === roleParam );
      // console.log('second resultsaa', checkRoleExistence(postData[key].id));

      if (!this.loadedUserPosts) {
        this.loadedUserPosts = postData;
      } else {

        for (const key in postData) {
          if (postData.hasOwnProperty(key)) {
            const itshere = this.checkRoleExistencePost(postData[key].id);
            if (itshere) {
            } else  {
                this.loadedUserPosts.push(postData[key]);
            }
          }
        }

      }

    });

  }

  checkRoleExistencePost(id: string):boolean {
    return this.loadedUserPosts.some(r => r.id === id);
  }


  async retrieveUserPosts() {
    const { value } = await Storage.get({ key : 'authData'}) ;
    const dic = JSON.parse(value);
    const dicToken = dic.token;
    this.postservice.fetchUserPosts(dicToken).subscribe(data => {
      this.postservice.getUserPosts.subscribe(resData => {
        this.loadedUserPosts = resData;
        const count = Object.keys(this.loadedUserPosts).length;
        this.userPostCount = count;
      });
    });
  }



  onOpenListingDetails(post) {
    this.routes.navigateByUrl(`board/discover/post-detail/${post.id}`);
  }



  async presentAlertConfirm(postId: string, slidingitem: IonItemSliding) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete Item',
      message: '<strong>Are you sure, this listing will be taken down</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.onDeleteListing(postId, slidingitem);
          }
        }
      ]
    });

    await alert.present();
  }



  onDeleteListing(id, slidingItem: IonItemSliding) {

    if(this.loadedUserPosts.length > 0) {
      this.userHasLoadedListings = true;
      
    } else if (this.loadedUserPosts.length  <= 0) {
      this.userHasLoadedListings  = false;
    }


    let c = this.loadedUserPosts.filter(b => b.id !== id);
    this.loadedUserPosts = c;
    console.log('this is usersDEEEEEEl', c);

    this.postservice.onPostDelete(id).then(() => {
      // this.ionViewWillEnter();
    });

    slidingItem.close();
}



  changeLayout(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'gridLayout') {
        this.gridLayout = true;
        this.itemsLayout = false;
      
    }  else if (event.detail.value === 'itemsLayout') {
        this.itemsLayout = true;
        this.gridLayout = false;
    } 
  }



}
