import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryKeyDialogComponent } from './ministry-key-dialog.component';

describe('MinistryKeyDialogComponent', () => {
  let component: MinistryKeyDialogComponent;
  let fixture: ComponentFixture<MinistryKeyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinistryKeyDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinistryKeyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
