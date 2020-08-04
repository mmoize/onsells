import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateMessagePage } from './create-message.page';

describe('CreateMessagePage', () => {
  let component: CreateMessagePage;
  let fixture: ComponentFixture<CreateMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMessagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
