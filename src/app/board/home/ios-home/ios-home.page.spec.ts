import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IosHomePage } from './ios-home.page';

describe('IosHomePage', () => {
  let component: IosHomePage;
  let fixture: ComponentFixture<IosHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IosHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IosHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
