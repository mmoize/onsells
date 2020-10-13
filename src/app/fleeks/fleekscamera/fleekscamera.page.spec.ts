import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FleekscameraPage } from './fleekscamera.page';

describe('FleekscameraPage', () => {
  let component: FleekscameraPage;
  let fixture: ComponentFixture<FleekscameraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleekscameraPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FleekscameraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
