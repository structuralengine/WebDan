import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionForcesComponent } from './section-forces.component';

describe('SectionForcesComponent', () => {
  let component: SectionForcesComponent;
  let fixture: ComponentFixture<SectionForcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionForcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionForcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
