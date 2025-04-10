import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeWheelComponent } from './theme-wheel.component';

describe('ThemeWheelComponent', () => {
  let component: ThemeWheelComponent;
  let fixture: ComponentFixture<ThemeWheelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeWheelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
