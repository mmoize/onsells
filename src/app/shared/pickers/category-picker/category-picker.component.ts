import { Subcategory } from './../../../board/subcategoy.model';
import { CategoyService } from './../../../board/categoy.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-category-picker',
  templateUrl: './category-picker.component.html',
  styleUrls: ['./category-picker.component.scss'],
})
export class CategoryPickerComponent implements OnInit {
  @Output() categoryPick = new EventEmitter<Subcategory>();
  @Input() showPreview = false;
  homeGardenCategoryList;
  clothingAccCategoryList;
  eletronicsCategoryList;
  familyCategoryList;
  hobbiesCategoryList;
  entertainmentCategoryList;
  selectedCategory;

  constructor(
    private modalCtrl: ModalController,
    private categoryservice: CategoyService) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.homeGardenCategoryList = this.categoryservice.getHomeAndGardenCategory(); 
    this.clothingAccCategoryList = this.categoryservice.getClothingAndAcc();
    this.familyCategoryList = this.categoryservice.getFamilyCategory();
    this.eletronicsCategoryList = this.categoryservice.getElectronicsCategory();
    this.hobbiesCategoryList = this.categoryservice.getHobbiesCategory();
    this.entertainmentCategoryList = this.categoryservice.getEntertainmentCategory();
  }

  onExist() {
      
    }

    onChange(event) {
      this.modalCtrl.dismiss(this.selectedCategory);
    //   if (event) {
    //     //this.modalCtrl.dismiss(event);
    //     this.modalCtrl.dismiss(this.selectedCategory);
    //   }
    //   console.log('events', event);
    }

}
