import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CurrentListingsPage } from './current-listings.page';

describe('CurrentListingsPage', () => {
  let component: CurrentListingsPage;
  let fixture: ComponentFixture<CurrentListingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentListingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentListingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
