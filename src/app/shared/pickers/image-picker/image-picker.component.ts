import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
import '@ionic/pwa-elements';



@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  usePicker = false;
  @Input() showPreview = false;
  @Output() imagePick = new EventEmitter<string | File>();
  selectedImage: string;


  constructor(private sanitizer: DomSanitizer,
              private platForm: Platform
              ) { }

  ngOnInit() {
    console.log('Mobile', this.platForm.is('mobile'));
    console.log('Hybrid', this.platForm.is('hybrid'));
    console.log('ios', this.platForm.is('ios'));
    console.log('android', this.platForm.is('android'));
    console.log('Desktop', this.platForm.is('desktop'));
    if ((this.platForm.is('mobile') && !this.platForm.is('hybrid'))
     || this.platForm.is('desktop')) {
       this.usePicker = true;
     }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.DataUrl
    }).then(image => {
       this.selectedImage = image.dataUrl;
       this.imagePick.emit(image.dataUrl);
    })
    .catch(error => {
      console.log(error);
      if (this.usePicker) {
        this.filePickerRef.nativeElement.click();
      }
      return false;
    });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const datUrl = fr.result.toString();
      this.selectedImage = datUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }

}
