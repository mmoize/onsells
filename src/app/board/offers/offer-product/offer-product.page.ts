import { Post } from './../../post.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-offer-product',
  templateUrl: './offer-product.page.html',
  styleUrls: ['./offer-product.page.scss'],
})
export class OfferProductPage implements OnInit {
  
  @Input() offers: Post;
  constructor() { }

  ngOnInit() {
  }

}
