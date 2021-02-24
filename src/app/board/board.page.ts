
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit {


  constructor(
    private routes: Router,
  ) { }

  ngOnInit() {
  }

  openmessages() {
    this.routes.navigateByUrl(`/messages`);
  }
  openFleeks() {
    this.routes.navigateByUrl(`/fleeks`);
  }

}
