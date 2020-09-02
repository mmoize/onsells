import { CategoryPickerComponent } from './../../../shared/pickers/category-picker/category-picker.component';
import { stringify } from 'querystring';
import { PostService } from './../../post.service';
import { CameraSource, Camera, CameraResultType } from '@capacitor/core';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Platform, ActionSheetController, LoadingController, ModalController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PlaceLocation } from 'src/app/location.model';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.page.html',
  styleUrls: ['./new-product.page.scss'],
})
export class NewProductPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  ClickedProdImage = false;
  productPhotoCount;
  formPhotoList = [];
  selectedImage = [];
  theSelectedImage = [];
  form: FormGroup;
  addedImage = false;
  selectedCategory;




  constructor(private plt: Platform,
              private sanitizer: DomSanitizer ,
              private modalCtrl: ModalController,
              private routes: Router,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private postservice: PostService,
              private actionSheetCtrl: ActionSheetController) { }

               slideOpts = {
                slidesPerView: 3,
                coverflowEffect: {
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                },
                on: {
                  beforeInit() {
                    const swiper = this;

                    swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
                    swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

                    swiper.params.watchSlidesProgress = true;
                    swiper.originalParams.watchSlidesProgress = true;
                  },
                  setTranslate() {
                    const swiper = this;
                    const {
                      width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
                    } = swiper;
                    const params = swiper.params.coverflowEffect;
                    const isHorizontal = swiper.isHorizontal();
                    const transform$$1 = swiper.translate;
                    const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
                    const rotate = isHorizontal ? params.rotate : -params.rotate;
                    const translate = params.depth;
                    // Each slide offset from center
                    for (let i = 0, length = slides.length; i < length; i += 1) {
                      const $slideEl = slides.eq(i);
                      const slideSize = slidesSizesGrid[i];
                      const slideOffset = $slideEl[0].swiperSlideOffset;
                      const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;

                      let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
                      let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
                      // var rotateZ = 0
                      let translateZ = -translate * Math.abs(offsetMultiplier);

                      let translateY = isHorizontal ? 0 : params.stretch * (offsetMultiplier);
                      let translateX = isHorizontal ? params.stretch * (offsetMultiplier) : 0;

                       // Fix for ultra small values
                      if (Math.abs(translateX) < 0.001) { translateX = 0; }
                      if (Math.abs(translateY) < 0.001) { translateY = 0; }
                      if (Math.abs(translateZ) < 0.001) { translateZ = 0; }
                      if (Math.abs(rotateY) < 0.001) { rotateY = 0; }
                      if (Math.abs(rotateX) < 0.001) { rotateX = 0; }

                      // tslint:disable-next-line: max-line-length
                      const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

                      $slideEl.transform(slideTransform);
                      $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
                      if (params.slideShadows) {
                        // Set shadows
                        // tslint:disable-next-line: max-line-length
                        let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
                        // tslint:disable-next-line: max-line-length
                        let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
                        if ($shadowBeforeEl.length === 0) {
                          $shadowBeforeEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
                          $slideEl.append($shadowBeforeEl);
                        }
                        if ($shadowAfterEl.length === 0) {
                          $shadowAfterEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
                          $slideEl.append($shadowAfterEl);
                        }
                        if ($shadowBeforeEl.length) { $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0; }
                        if ($shadowAfterEl.length) { $shadowAfterEl[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0; }
                      }
                    }

                     // Set correct perspective for IE10
                    if (swiper.support.pointerEvents || swiper.support.prefixedPointerEvents) {
                      const ws = $wrapperEl[0].style;
                      ws.perspectiveOrigin = `${center}px 50%`;
                    }
                  },
                  setTransition(duration) {
                    const swiper = this;
                    swiper.slides
                      .transition(duration)
                      .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
                      .transition(duration);
                  }
                }
              };



            

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(150)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      slug: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(150)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      category_name: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      category_slug: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      category_parent: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      // location: new FormControl(null, {
      //   validators: [Validators.required
      //   ]}),
      // image: new FormControl(null)
    });
  }

  async SelectImageSource() {
    const buttons = [
     {
      text: 'Take Photo',
      icon: 'camera',
      handler: () => {
        this.addImage(CameraSource.Camera);
      },
    },
    {
      text: 'Choose From Photos Photo',
      icon: 'image',
      handler: () => {
        this.addImage(CameraSource.Photos);
      }
    }
    ];

    if (!this.plt.is('hybrid')) {
      buttons.push({
        text: 'Choose a File',
        icon: 'attach',
        handler: () => {
          this.fileInput.nativeElement.click();

        }
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons
    });
    await actionSheet.present();

  }

  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
    }).then(image => {

      let imageData;
      let imageFormat;
      const blobData = this.getBlob(image.base64String);
      const blobDatas = this.b64toBlob(image.base64String, `image/${image.format}`);
      console.log('this is your image', blobData);
      const imageName = 'Give me a name';
      imageData = blobDatas;
      imageFormat = image.format;
      const urlCreator = window.URL || window.webkitURL;
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlCreator.createObjectURL(blobDatas));
      

      function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
      }
      console.log('my id', getRandomArbitrary(1,20));
      
      const ranId = getRandomArbitrary(1,20);
      const prevImage = {};
      const uploadImage = {};
      prevImage['id'] = ranId;
      prevImage['image'] = safeUrl;
      prevImage['format'] = imageFormat;

      // prevImagex['image'] = urlCreator.createObjectURL(blobData);
     
      uploadImage['image'] = blobDatas;
      uploadImage['format'] = imageFormat;
      uploadImage['id'] = ranId;

      this.selectedImage.push(prevImage);
      this.theSelectedImage.push(uploadImage);
      this.formPhotoList.push(prevImage);
      console.log('this is formlist', this.selectedImage);

      if (this.selectedImage) {
        const count = Object.keys(this.selectedImage).length;
        this.productPhotoCount = count;
      }

      this.addedImage = true;

    });
  }


  onClickProdImage() {
    if (this.ClickedProdImage) {
      this.ClickedProdImage = false;
    } else {
      this.ClickedProdImage = true;
    }
  }



   onDelete(id) {

    let b = this.theSelectedImage.filter(b => b.id !== id);

    this.theSelectedImage = b;

    // function shuffle(array) {
    //   let currentIndex = array.length, temporaryValue, randomIndex;
    
    //   // While there remain elements to shuffle...
    //   while (0 !== currentIndex) {

    //     // Pick a remaining element...
    //     randomIndex = Math.floor(Math.random() * currentIndex);
    //     currentIndex -= 1;
    
    //     // And swap it with the current element.
    //     temporaryValue = array[currentIndex];
    //     array[currentIndex] = array[randomIndex];
    //     array[randomIndex] = temporaryValue;
    //   }
    
    //   return array;
    // }

    let c = this.selectedImage.filter(b => b.id !== id);
    // shuffle(c);
    this.selectedImage = c;

    if (this.selectedImage) {
      const count = Object.keys(this.selectedImage).length;
      this.productPhotoCount = count;

    } else {
      this.addedImage = false;
      const count = Object.keys(this.selectedImage).length;
      this.productPhotoCount = count;
    }

    return console.log('this axax', this.selectedImage);

  }


  onClick(){
    this.modalCtrl.create({
      component:CategoryPickerComponent,
    
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss().then(data => {
        this.selectedCategory = data
        this.form.patchValue({category_name: this.selectedCategory.data.name});
        this.form.patchValue({category_slug: this.selectedCategory.data.slug});
        this.form.patchValue({category_parent: this.selectedCategory.data.parent});
        console.log('this is categor', this.selectedCategory.data.slug);
      });
    });
  }



  createProduct() {
    this.loadingCtrl.create({keyboardClose:true, message: 'Creating your item..'})
    .then(loadingEl => {
      loadingEl.present();
      const data = new FormData();
      for (const key in this.theSelectedImage) {
        if (this.theSelectedImage.hasOwnProperty(key)) {
         console.log('this is ur images',  this.theSelectedImage[key].image);
         data.append('image', this.theSelectedImage[key].image, `product.${this.theSelectedImage[key].format}` );
        }
      }

      function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
      }
      console.log('my id', getRandomArbitrary(1, 1000));
      let barcode = getRandomArbitrary(1, 1000);

      data.append('title', this.form.value.title);
      data.append('description', this.form.value.description);
      data.append('price', this.form.value.price);
      data.append('slug', this.form.value.slug);
      data.append('barcode', barcode);
      data.append('category_name', this.form.value.category_name);
      data.append('category_slug', this.form.value.category_slug);
      data.append('category_parent', this.form.value.category_parent);

      console.log('this is ur imagesasa',  data.get('image'));
      console.log('your new product', barcode);

      this.postservice.createProductUpload(data).then(resData => {
        console.log('your new product', resData);

      });
      setTimeout(() => {
        loadingEl.dismiss();
        this.routes.navigateByUrl(`/board/offers`);
      }, 2000);

    });

  }


  private showAlert() {
    this.alertCtrl.create({
      header: 'You are about leave',
      // tslint:disable-next-line: object-literal-shorthand
      message: 'Save Draft',
      buttons: ['okay', 'Discard'],
    }).then(alertEl => {
      alertEl.present();
    });
  }


  // ionViewWillLeave() {
  //  this.showAlert();
  // }

  onPostProduct() {
    this.createProduct();
    setTimeout(() => {
      this.routes.navigateByUrl(`/board/offers/new-post`);
    },2500);

  }


  // onClick() {
  //   this.modalCtrl.create({component: CategoryPickerComponent}).then(modelEl => {
  //     modelEl.onDidDismiss().then(modalData => {
  //       if (!modalData.data) {
  //         return;
  //       }

  //     });
  //     modelEl.present();
  //   });
  // }






  getBlob(b64Data) {
    const contentType = '';
    const  sliceSize = 512;

    b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}
