import { Post } from './../../board/post.model';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
})
export class UserprofileComponent implements OnInit {
  @Input() selectedPost: Post;
  @Input() selectedProfile;
  imagestring;
  image_string

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    if (this.selectedPost) {
      console.log('user_post', this.selectedPost);
      this.image_string = this.selectedPost.owner;
      this.imagestring = this.image_string.image;
      console.log('user_post_iamge', this.selectedPost);
    } else if (this.selectedProfile) {
      this.imagestring = this.selectedProfile.image;
    }


  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  doRefresh(event) {



    setTimeout(() => {
      console.log('user_post', this.selectedPost);
      this.image_string = this.selectedPost.owner;
      this.imagestring = this.image_string.image;
      console.log('user_post_iamge', this.imagestring);
      event.target.complete();
    }, 2000);
  }

  onReturnToProfile() {
    this.modalCtrl.dismiss();
  }

}
 