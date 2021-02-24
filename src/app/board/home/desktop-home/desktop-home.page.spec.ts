import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DesktopHomePage } from './desktop-home.page';

describe('DesktopHomePage', () => {
  let component: DesktopHomePage;
  let fixture: ComponentFixture<DesktopHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesktopHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DesktopHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
