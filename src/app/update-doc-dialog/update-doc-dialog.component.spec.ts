import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDocDialogComponent } from './update-doc-dialog.component';

describe('UpdateDocDialogComponent', () => {
  let component: UpdateDocDialogComponent;
  let fixture: ComponentFixture<UpdateDocDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDocDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDocDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
