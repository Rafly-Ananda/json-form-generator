import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSchemaDialogComponent } from './new-schema-dialog.component';

describe('NewSchemaDialogComponent', () => {
  let component: NewSchemaDialogComponent;
  let fixture: ComponentFixture<NewSchemaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSchemaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSchemaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
