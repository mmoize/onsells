
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-offer-product',
  templateUrl: './offer-product.page.html',
  styleUrls: ['./offer-product.page.scss'],
})
export class OfferProductPage implements OnInit {
  
  @Input() offers: Post;
  constructor( ) { }

  ngOnInit() {
  }



}
