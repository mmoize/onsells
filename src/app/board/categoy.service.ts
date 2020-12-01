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
      '22',
      'Tools',
      'tool',
      '1'
    ),
    new Subcategory(
      '7',
      'Furniture',
      'furniture ',
      '1'
    ),
    new Subcategory(
      '8',
      'Garden',
      'garden',
      '1'
    ),
    new Subcategory(
      '23',
      'Appliances',
      'Electronics',
      '1'

    ),
    new Subcategory(
      '25',
      'Household',
      'household',
      '1'

    ),


  ];
  clothingAccessoriesCategoryList = [
    new Subcategory(
      '24',
      'Jewelry & Accessories',
      'jewelry_&_accessories',
      '2'
    ),
    new Subcategory(
      '9',
      'Bags & luggage',
      'Bags_&_luggage',
      '2'
    ),
    new Subcategory(
      '10',
      'Men\'s Clothing & Shoes',
      'mens_clothing_&_shoes',
      '2'
    ),
    new Subcategory(
      '28',
      'Women\'s Clothing & Shoes',
      'womens_clothing_&_shoes',
      '2'

    ),


  ];

  ElectronicsCategoryList = [
    new Subcategory(
      '18',
      'Mobile Phones',
      'mobile_phones',
      '3'
    ),
    new Subcategory(
      '13',
      'Electronics & Computers',
      'electronics_&_Computers',
      '3'
    ),
  ];


  familyCategoryList = [
    new Subcategory(
      '29',
      'Toy & Games',
      'toy_&_Games',
      '4'
    ),
    new Subcategory(
      '21',
      'Baby & Kids',
      'baby_&_kids',
      '4'
    ),
    new Subcategory(
      '17',
      'Pet Supplies',
      'pet_supplies',
      '4'
    ),
    new Subcategory(
      '12',
      'Health & Beauty',
      'health_&_beauty',
      '4'

    ),

    ];


    hobbiesCategoryList = [
      new Subcategory(
        '11',
        'Sports & Outdoors',
        'sports_&_outdoors',
        '6'
      ),
      new Subcategory(
        '15',
        'Musical Instrunments',
        'musical_instrunments',
        '6'
      ),
      new Subcategory(
        '14',
        'Arts & Crafts',
        'art_&_crafts',
        '6'
      ),
      new Subcategory(
        '22',
        'Antiques & Collectibles',
        'antiques_&_collectibles',
        '6'
  
      ),
      new Subcategory(
        '26',
        'Auto Parts',
        'auto_parts',
        '6'
  
      ),
      new Subcategory(
        '30',
        'Bicycles',
        'bicycles',
        '6'
  
      ),
  
      ];
      entertainmentCategoryList = [
        new Subcategory(
          '32',
          'Books, Movies & Music',
          'books_&_movies_&_music',
          '31'
        ),
        new Subcategory(
          '33',
          'Video Games',
          'video_games',
          '31'
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


