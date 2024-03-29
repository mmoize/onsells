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
import { MainFilterComponent } from './filters/main-filter/main-filter.component';
import { FormsModule } from '@angular/forms';

@NgModule ({
    declarations: [LocationPickerComponent,
                   ImageviewerComponent,
                   MapFilterModalComponent,
                   UserprofileComponent,
                   MapModalComponent,
                   MainFilterComponent,
                   ImagePickerComponent],
    imports: [CommonModule, IonicModule,FormsModule, NgxIonicImageViewerModule],
    exports: [LocationPickerComponent,
              ImageviewerComponent,
              MapModalComponent,
              ImagePickerComponent,
              UserprofileComponent],
    entryComponents: [MapModalComponent
                     ]
})

export class SharedModule {}
