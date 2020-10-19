import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FleekPage } from './fleek.page';

describe('FleekPage', () => {
  let component: FleekPage;
  let fixture: ComponentFixture<FleekPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleekPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FleekPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
