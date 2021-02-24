import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AndroidHomePage } from './android-home.page';

describe('AndroidHomePage', () => {
  let component: AndroidHomePage;
  let fixture: ComponentFixture<AndroidHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AndroidHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AndroidHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
