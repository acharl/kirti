import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SlaPage } from './sla.page';

describe('SlaPage', () => {
  let component: SlaPage;
  let fixture: ComponentFixture<SlaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SlaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
