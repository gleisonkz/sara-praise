import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import {
    BaseScaleDialogData, injectBaseDialogData, MatDialogDataNotFoundError
} from './inject-base-dialog-data.function';

@Component({ template: '' })
class TestComponent implements OnInit {
  data = injectBaseDialogData();

  constructor(private matDialogRef: MatDialogRef<TestComponent>) {}

  ngOnInit(): void {
    this.matDialogRef.close(this.data);
  }
}

describe('[DI Function] - injectBaseDialogData', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  it('should inject dialog data when dialog is opened', () => {
    const dialog = TestBed.inject(MatDialog);
    const dialogData: BaseScaleDialogData = {
      ministryID: 123,
      scaleID: 2,
    };

    dialog
      .open(TestComponent, { data: dialogData })
      .afterClosed()
      .subscribe((data) => {
        expect(data).toEqual(dialogData);
      });
  });

  it('should throw error when dialog data is not injected', () => {
    const dialog = TestBed.inject(MatDialog);

    expect(() => {
      dialog.open(TestComponent).afterClosed().subscribe();
    }).toThrowError(MatDialogDataNotFoundError);
  });
});
