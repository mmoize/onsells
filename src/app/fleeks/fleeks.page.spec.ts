import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FleeksPage } from './fleeks.page';

describe('FleeksPage', () => {
  let component: FleeksPage;
  let fixture: ComponentFixture<FleeksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleeksPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FleeksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
