import { ChatPage } from './../../../messages/chat/chat.page';
import { NewMessageComponent } from './../../../shared/new-message/new-message.component';
import { CreateMessagePage } from './../../../messages/create-message/create-message.page';
import { UserprofileComponent } from './../../../shared/userprofile/userprofile.component';
import { PostService } from './../../post.service';
import { Post } from './../../post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { take, map } from 'rxjs/operators';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit, OnDestroy {

  constructor(private router: Router,
              private navCtrl: NavController,
              private modalCtrl: ModalController,
              private postService: PostService,
              private route: ActivatedRoute,
              private actionSheetCtrl: ActionSheetController,
              private loadingCtrl: LoadingController,
              private authService: AuthService,
              private alertCtrl: AlertController,
) { }
  avatarImageStr;
  isLoading = false;
  isBookable = false;
  post: Post;
  private aPostSub: Subscription;



  slideOpts = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.params = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { slides } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          let tx = -offset$$1;
          if (!swiper.params.virtualTranslate) { tx -= swiper.translate; }
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity = swiper.params.fadeEffect.crossFade
            ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
            : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl
            .css({
              opacity: slideOpacity,
            })
            .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          slides.transitionEnd(() => {
            if (eventTriggered) { return; }
            if (!swiper || swiper.destroyed) { return; }
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      },
    }
  };


  ngOnInit() {
    let don ='';
    this.route.paramMap.subscribe(async paramMap => {
      don = paramMap.get('postId')
      console.log('this is the id',paramMap.get('postId') );
      if (!paramMap.has('postId')) {
        this.navCtrl.navigateBack('/board/discover');
        return;
      }
      this.isLoading = false;
      this.aPostSub = ( await this.postService.getPostDetail(paramMap.get('postId'))).subscribe(postDetail => {
        this.post = postDetail;
        this.avatarImageStr = postDetail.owner['image'];
        console.log('this is postDetail', postDetail);
        console.log('this is postDetail', this.avatarImageStr);
      }

      
      // , error => {
      //   this.alertCtrl.create({
      //         header: 'An error occurred '  ,
      //         message: 'Could not load post',
      //         buttons: [{text: 'Okay', handler: () => {
      //           this.router.navigateByUrl('/board/discover/');
      //         }
      //       }]
      //     }).then(alertEl => alertEl.present());
      // }
      );
    });
  }

  ngOnDestroy() {
    if (this.aPostSub) {
      this.aPostSub.unsubscribe();
    }
  }

  ionViewDidEnter(){
    sessionStorage.setItem('other_userid', this.post?.owner.id);
    sessionStorage.setItem('other_username', this.post.owner.username);
  }

  onback() {
    this.router.navigateByUrl('/board/discover');
  }


  openModal() {
    this.modalCtrl.create({
      component:UserprofileComponent,
      componentProps: {selectedPost: this.post}
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }

  openMessageModal() {
    this.openChatDetail()
    console.log('senddd post', this.post.owner.username);
    this.modalCtrl.create({
      component: ChatPage,
      componentProps: {seletedpost: this.post}
    }).then(modalEl => {
      modalEl.present();
    });

  }


  openChatDetail() {
    console.log('this is postDetail', this.post);
    sessionStorage.setItem('other_userid', this.post.owner.id);
    sessionStorage.setItem('other_username', this.post.owner.username);

  }




}
