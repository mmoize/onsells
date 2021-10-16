import { DesktopHomePage } from './desktop-home/desktop-home.page';
import { IosHomePage } from './ios-home/ios-home.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { IosHomePageModule } from './ios-home/ios-home.module';
import { DesktopHomePageModule } from './desktop-home/desktop-home.module';
import { AndroidHomePageModule } from './android-home/android-home.module';
import { AndroidHomePage } from './android-home/android-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, IosHomePage, AndroidHomePage, DesktopHomePage ]
})
export class HomePageModule {} 
