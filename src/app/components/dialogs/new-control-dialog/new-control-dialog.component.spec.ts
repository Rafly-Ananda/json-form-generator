import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewControlDialogComponent } from './new-control-dialog.component';

describe('NewControlDialogComponent', () => {
  let component: NewControlDialogComponent;
  let fixture: ComponentFixture<NewControlDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewControlDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewControlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
