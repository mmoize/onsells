import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfferProductPage } from './offer-product.page';

describe('OfferProductPage', () => {
  let component: OfferProductPage;
  let fixture: ComponentFixture<OfferProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferProductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfferProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
