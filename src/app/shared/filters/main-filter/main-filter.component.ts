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
  selectedMinPrice;
  selectedMaxPrice;
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
      this.selectedMinPrice = evt.lower;
      console.log('this f', evt)
    }
    if (evt.upper) {
      this.maximumPrice = evt.upper;
      this.selectedMaxPrice = evt.upper;
      console.log('this f', evt)
    }
  }

  onInputMinChange(data) {
    console.log('this is min and max', data);
    this.selectedPrice.lower = data;
    if (!this.selectedPrice === undefined) {
      this.selectedPrice.lower = data;
      this.minimumPrice = data;
    }
    
  }
  onInputMaxChange(data) {
    console.log('this is min and max', data);
    console.log('this is min and max', this.selectedPrice);
    this.selectedPrice.upper = data;
    if (!this.selectedPrice === undefined) {
      this.selectedPrice.upper = data;
      this.maximumPrice=data
    }
  }

  onExit() {
    const searchData = {};
    if (this.selectedMaxPrice !== undefined && this.selectedMinPrice !== undefined){
      searchData['min'] = this.selectedMinPrice;
      searchData['max'] = this.selectedMaxPrice;
    } else {
      searchData['min'] = this.minimumPrice;
      searchData['max'] = this.maximumPrice;
    }
    

    searchData['category'] = this.selectedCategory;

    console.log('this is searchdata', searchData['min'], searchData['max']);
    this.modalCtrl.dismiss(
      searchData
    );
  }

}
