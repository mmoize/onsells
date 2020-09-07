import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Category } from 'src/app/board/category.model';

@Component({
  selector: 'app-main-filter',
  templateUrl: './main-filter.component.html',
  styleUrls: ['./main-filter.component.scss'],
})
export class MainFilterComponent implements OnInit {
  
  @Output() categoryPick = new EventEmitter();
  @Input()  selectedCategory;
  selectedPrice;
  minimumPrice;
  maximumPrice;

  constructor( 
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    
    const allcategories =     new Category(
          '0',
          'All',
          'assets/icons/homeandgarden.svg'
    );
    if (!this.selectedCategory) {
      this.selectedCategory = allcategories;
    }
    
    
  }

  onChange(evt) {
    if (evt.lower) {
      this.minimumPrice = evt.lower;
    }
    if (evt.upper) {
      this.maximumPrice = evt.upper;
    }
  }

  onExit() {
    const priceData = {};
    priceData['min'] = this.minimumPrice;
    priceData['max'] = this.maximumPrice;
    
    this.modalCtrl.dismiss(
      priceData
    );
  }

}
