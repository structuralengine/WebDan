import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FatiguesComponent } from './fatigues.component';

describe('FatiguesComponent', () => {
  let component: FatiguesComponent;
  let fixture: ComponentFixture<FatiguesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FatiguesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FatiguesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
