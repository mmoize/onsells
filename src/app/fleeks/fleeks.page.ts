import { FleekscameraPage } from './fleekscamera/fleekscamera.page';
import { HomePage } from './home/home.page';
import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { MessageService } from 'src/app/messages/message.service';
import { SuperTabs } from '@ionic-super-tabs/angular';
import { SuperTabsConfig } from '@ionic-super-tabs/core';
import { FleekPage } from './fleek/fleek.page';

@Component({
  selector: 'app-fleeks',
  templateUrl: './fleeks.page.html',
  styleUrls: ['./fleeks.page.scss'],
})
export class FleeksPage implements OnInit {

  tab1 = FleekscameraPage;
  tab2 = HomePage;
  tab3 = FleekPage;
  searchbar = false;
  @ViewChild(SuperTabs) superTabs: SuperTabs;

  config: SuperTabsConfig = {
    debug: true,
    allowElementScroll: false,
  };



  constructor( ) {  }

  ngOnInit() {
  }




}
