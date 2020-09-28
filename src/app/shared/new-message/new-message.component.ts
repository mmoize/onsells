import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'src/app/messages/message.service';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss'],
})
export class NewMessageComponent implements OnInit {



  constructor(private modalCtrl: ModalController,
              private messageService: MessageService,
              ) { }

  ngOnInit() {

  }


  


}
