import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Test001Component } from './test001.component';

describe('Test001Component', () => {
  let component: Test001Component;
  let fixture: ComponentFixture<Test001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Test001Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Test001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
