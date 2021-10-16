
import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { Subcategory } from '../models/subcategoy.model';

@Injectable({
  providedIn: 'root'
})
export class CategoyService {

  constructor() { }

  categoryList = [
    new Category(
      '0',
      'All',
      'assets/icons/homeandgarden.svg'
    ),
    new Category(
      '1',
      'Home & Garden ',
      'assets/icons/homeandgarden.svg'
    ),
    new Category(
      '31',
      'Entertainment',
      'assets/icons/entertainment.svg'
    ),
    new Category(
      '3',
      'Electronics',
      'assets/icons/electronics.svg'

    ),
    new Category(
      '4',
      'Family',
      'assets/icons/family.svg'

    ),
    new Category(
      '2',
      'Clothing & Accessories',
      'assets/icons/clothingandaccessories.svg'

    ),
    // new Category(
    //   '5',
    //   'Classifieds',
    //   'assets/icons/classifieds.svg'
    // ),
    new Category(
      '6',
      'Hobbies',
      'assets/icons/Hobies.svg'
    ),

  ];

  HomeGardenCategoryList = [
    new Subcategory(
      '8',
      'Tools',
      'tool',
      '1'
    ),
    new Subcategory(
      '9',
      'Furniture',
      'furniture ',
      '1'
    ),
    new Subcategory(
      '10',
      'Garden',
      'garden',
      '1'
    ),
    new Subcategory(
      '11',
      'Appliances',
      'appliances',
      '1'

    ),
    new Subcategory(
      '12',
      'Household',
      'household',
      '1'

    ),


  ];
  clothingAccessoriesCategoryList = [
    new Subcategory(
      '13',
      'Jewelry & Accessories',
      'jewelry_and_accessories',
      '5'
    ),
    new Subcategory(
      '14',
      'Bags & luggage',
      'Bags_and_luggage',
      '5'
    ),
    new Subcategory(
      '15',
      "Men's Clothing & Shoes",
      'mens_clothing_and_shoes',
      '5'
    ),
    new Subcategory(
      '16',
      "Women's Clothing & Shoes",
      'womens_clothing_and_shoes',
      '5'

    ),


  ];

  ElectronicsCategoryList = [
    new Subcategory(
      '17',
      'Mobile Phones',
      'mobile_phones',
      '3'
    ),
    new Subcategory(
      '18',
      'Electronics & Computers',
      'electronics_and_Computers',
      '3'
    ),
  ];


  familyCategoryList = [
    new Subcategory(
      '19',
      'Toy & Games',
      'toy_and_Games',
      '4'
    ),
    new Subcategory(
      '20',
      'Baby & Kids',
      'baby_and_kids',
      '4'
    ),
    new Subcategory(
      '21',
      'Pet Supplies',
      'pet_supplies',
      '4'
    ),
    new Subcategory(
      '22',
      'Health & Beauty',
      'health_and_beauty',
      '4'

    ),

    ];


    hobbiesCategoryList = [
      new Subcategory(
        '23',
        'Sports & Outdoors',
        'sports_and_outdoors',
        '7'
      ),
      new Subcategory(
        '24',
        'Musical Instrunments',
        'musical_instrunments',
        '7'
      ),
      new Subcategory(
        '25',
        'Arts & Crafts',
        'art_and_crafts',
        '7'
      ),
      new Subcategory(
        '26',
        'Antiques & Collectibles',
        'antiques_and_collectibles',
        '7'
  
      ),
      new Subcategory(
        '27',
        'Auto Parts',
        'auto_parts',
        '7'
  
      ),
      new Subcategory(
        '28',
        'Bicycles',
        'bicycles',
        '7'
      ),
  
      ];
      entertainmentCategoryList = [
        new Subcategory(
          '29',
          'Books, Movies & Music',
          'books_and_movies_and_music',
          '2'
        ),
        new Subcategory(
          '30',
          'Video Games',
          'video_games',
          '2'
        ),
      ]



      getHomeAndGardenCategory() {

        return this.HomeGardenCategoryList;
      }

      getClothingAndAcc() {
        return this.clothingAccessoriesCategoryList;
      }

      getElectronicsCategory() {
        return this.ElectronicsCategoryList;
      }

      getFamilyCategory() {
        return this.familyCategoryList;
      }

      getHobbiesCategory() {
        return this.hobbiesCategoryList;
      }


      getEntertainmentCategory() {
        return this.entertainmentCategoryList;
      }

}


