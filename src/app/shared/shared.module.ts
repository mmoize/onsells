import { CategoryPickerComponent } from './pickers/category-picker/category-picker.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';

@NgModule ({
    declarations: [LocationPickerComponent,  UserprofileComponent, MapModalComponent, ImagePickerComponent],
    imports: [CommonModule, IonicModule],
    exports: [LocationPickerComponent,  MapModalComponent, ImagePickerComponent, UserprofileComponent],
    entryComponents: [MapModalComponent]
})

export class SharedModule {}
