import { Subcategory } from './subcategoy.model';
import { Injectable } from '@angular/core';
import { Category } from './category.model';

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
      '7',
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
      'Tools',
      'tool',
      '1'
    ),
    new Subcategory(
      'Furniture',
      'furniture ',
      '1'
    ),
    new Subcategory(
      'Garden',
      'garden',
      '1'
    ),
    new Subcategory(
      'Appliances',
      'Electronics',
      '1'

    ),
    new Subcategory(
      'Household',
      'household',
      '1'

    ),


  ];
  clothingAccessoriesCategoryList = [
    new Subcategory(
      'Jewelry & Accessories',
      'jewelry_&_accessories',
      '2'
    ),
    new Subcategory(
      'Bags & luggage',
      'Bags_&_luggage',
      '2'
    ),
    new Subcategory(
      'Men\'s Clothing & Shoes',
      'mens_clothing_&_shoes',
      '2'
    ),
    new Subcategory(
      'Women\'s Clothing & Shoes',
      'womens_clothing_&_shoes',
      '2'

    ),


  ];

  ElectronicsCategoryList = [
    new Subcategory(
      'Mobile Phones',
      'mobile_phones',
      '3'
    ),
    new Subcategory(
      'Electronics & Computers',
      'electronics_&_Computers',
      '3'
    ),
  ];


  familyCategoryList = [
    new Subcategory(
      'Toy & Games',
      'toy_&_Games',
      '4'
    ),
    new Subcategory(
      'Baby & Kids',
      'baby_&_kids',
      '4'
    ),
    new Subcategory(
      'Pet Supplies',
      'pet_supplies',
      '4'
    ),
    new Subcategory(
      'Health & Beauty',
      'health_&_beauty',
      '4'

    ),

    ];


    hobbiesCategoryList = [
      new Subcategory(
        'Sports & Outdoors',
        'sports_&_outdoors',
        '6'
      ),
      new Subcategory(
        'Musical Instrunments',
        'musical_instrunments',
        '6'
      ),
      new Subcategory(
        'Arts & Crafts',
        'art_&_crafts',
        '6'
      ),
      new Subcategory(
        'Antiques & Collectibles',
        'antiques_&_collectibles',
        '6'
  
      ),
      new Subcategory(
        'Auto Parts',
        'auto_parts',
        '6'
  
      ),
      new Subcategory(
        'Bicycles',
        'bicycles',
        '6'
  
      ),
  
      ];
      entertainmentCategoryList = [
        new Subcategory(
          'Books, Movies & Music',
          'books_&_movies_&_music',
          '7'
        ),
        new Subcategory(
          'Video Games',
          'video_games',
          '7'
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


