import { CategoryPickerComponent } from './pickers/category-picker/category-picker.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { MapFilterModalComponent } from './filters/map-filter-modal/map-filter-modal.component';
import { ImageviewerComponent } from './imageviewer/imageviewer.component';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

@NgModule ({
    declarations: [LocationPickerComponent,
                   ImageviewerComponent,
                   MapFilterModalComponent,
                   UserprofileComponent,
                   MapModalComponent,
                   ImagePickerComponent],
    imports: [CommonModule, IonicModule, NgxIonicImageViewerModule],
    exports: [LocationPickerComponent,
              ImageviewerComponent,
              //MapFilterModalComponent,
              MapModalComponent,
              ImagePickerComponent,
              UserprofileComponent],
    entryComponents: [MapModalComponent
                     //,MapFilterModalComponent
                     ]
})

export class SharedModule {}
