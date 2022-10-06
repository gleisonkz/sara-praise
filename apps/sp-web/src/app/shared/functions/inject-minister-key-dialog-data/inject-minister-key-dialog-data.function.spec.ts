import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import {
    eDialogMode, injectMinisterKeyDialogData, MinisterKeyDialogData,
    MinisterKeyDialogDataNotFoundError
} from './inject-minister-key-dialog-data.function';

@Component({ template: '' })
class TestComponent implements OnInit {
  data = injectMinisterKeyDialogData();

  constructor(private matDialogRef: MatDialogRef<TestComponent>) {}

  ngOnInit(): void {
    this.matDialogRef.close(this.data);
  }
}

describe('[DI Function] - injectMinisterKeyDialogData', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  it('should inject dialog data when dialog is opened', () => {
    const dialog = TestBed.inject(MatDialog);
    const dialogData: MinisterKeyDialogData = {
      ministryID: 123,
      memberID: undefined,
      songID: undefined,
    };

    dialog
      .open(TestComponent, { data: dialogData })
      .afterClosed()
      .subscribe((data) => {
        expect(data).toEqual({
          ...dialogData,
          mode: eDialogMode.CREATE,
        });
      });
  });

  it('should inject dialog data when dialog is opened with edit mode', () => {
    const dialog = TestBed.inject(MatDialog);
    const dialogData: MinisterKeyDialogData = {
      ministryID: 123,
      memberID: undefined,
      songID: undefined,
      mode: eDialogMode.EDIT,
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
    }).toThrowError(MinisterKeyDialogDataNotFoundError);
  });
});
