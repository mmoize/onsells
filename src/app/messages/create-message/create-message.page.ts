import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.page.html',
  styleUrls: ['./create-message.page.scss'],
})
export class CreateMessagePage implements OnInit {

  roomsMessages;
  topAvatar;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {

  }

}
