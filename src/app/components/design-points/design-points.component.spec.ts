import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignPointsComponent } from './design-points.component';

describe('DesignPointsComponent', () => {
  let component: DesignPointsComponent;
  let fixture: ComponentFixture<DesignPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
