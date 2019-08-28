import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionForceListComponent } from './section-force-list.component';

describe('SectionForceListComponent', () => {
  let component: SectionForceListComponent;
  let fixture: ComponentFixture<SectionForceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionForceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionForceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
