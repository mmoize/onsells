import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsermessagesPage } from './usermessages.page';

describe('UsermessagesPage', () => {
  let component: UsermessagesPage;
  let fixture: ComponentFixture<UsermessagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsermessagesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsermessagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
