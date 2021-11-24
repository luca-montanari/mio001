import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewDocDialogComponent } from './create-new-doc-dialog.component';

describe('CreateNewDocDialogComponent', () => {
  let component: CreateNewDocDialogComponent;
  let fixture: ComponentFixture<CreateNewDocDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewDocDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewDocDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
