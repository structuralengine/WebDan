import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SteelsComponent } from './steels.component';

describe('SteelsComponent', () => {
  let component: SteelsComponent;
  let fixture: ComponentFixture<SteelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SteelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
