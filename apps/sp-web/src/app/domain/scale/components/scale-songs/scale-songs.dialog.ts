import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

import {
    AvailableScaleSongResponse, eMinistryRole, ParticipantSelectItemResponse
} from '@sp/shared-interfaces';

import { FormArray } from '@ngneat/reactive-forms';
import {
    ScaleApiService
} from 'apps/sp-web/src/app/domain/ministry/core/services/scale.api.service';
import {
    injectBaseDialogData
} from 'apps/sp-web/src/app/domain/scale/pages/scale-create-edit/inject.base-dialog-data.function';
import { Observable, shareReplay, tap } from 'rxjs';

@Component({
  templateUrl: './scale-songs.dialog.html',
  styleUrls: ['./scale-songs.dialog.scss'],
})
export class ScaleSongsDialog implements OnInit {
  songListItems$: Observable<AvailableScaleSongResponse[]>;
  participantMinisters$: Observable<ParticipantSelectItemResponse[]>;
  scaleDialogData = injectBaseDialogData();
  scaleSongFormArray: FormArray<
    unknown,
    FormGroup<{
      scaleSongID: FormControl<number | null>;
      isChecked: FormControl<boolean | null>;
      memberID: FormControl<number | null | undefined>;
      songID: FormControl<number | null>;
      scaleID: FormControl<number | null>;
      ministerName: FormControl<string | null>;
      artistName: FormControl<string | null>;
      songTitle: FormControl<string | null>;
    }>
  > = new FormArray([]);

  hasFormChanged = new Map<number, boolean>();
  canSubmit = false;

  constructor(
    private readonly dialogRef: MatDialogRef<ScaleSongsDialog>,
    private readonly scaleApiService: ScaleApiService
  ) {}

  ngOnInit(): void {
    this.participantMinisters$ = this.scaleApiService
      .findAllParticipantsByRoleID(
        this.scaleDialogData.ministryID,
        this.scaleDialogData.scaleID,
        eMinistryRole.MINISTER
      )
      .pipe(shareReplay(1));

    this.songListItems$ = this.scaleApiService
      .findAvailableSongs(+this.scaleDialogData.ministryID, +this.scaleDialogData.scaleID)
      .pipe(
        tap((songListItems: AvailableScaleSongResponse[]) => {
          songListItems.forEach((songListItem: AvailableScaleSongResponse) => {
            this.scaleSongFormArray.push(this.createForm(songListItem));
          });
        })
      );
  }

  hasChanged() {
    const values = [...this.hasFormChanged.values()];
    const hasChanged = values.some((value) => value);
    return hasChanged;
  }

  submitForm() {
    const scaleSongFormArray = this.scaleSongFormArray.controls
      .filter((control) => {
        const songID = control.get('songID')?.value;
        if (!songID) throw new Error('songID is required');
        const hasChanged = this.hasFormChanged.get(songID);
        return hasChanged;
      })
      .map((control) => {
        return control.value;
      });

    this.dialogRef.close(scaleSongFormArray);
  }

  createForm(songListItem: AvailableScaleSongResponse) {
    this.hasFormChanged.set(songListItem.songID, false);
    const scaleSongFormGroup = new FormGroup({
      scaleSongID: new FormControl(songListItem.scaleSongID),
      isChecked: new FormControl(songListItem.isChecked),
      memberID: new FormControl(songListItem.memberID, Validators.required),
      scaleID: new FormControl(this.scaleDialogData.scaleID, Validators.required),
      songID: new FormControl(songListItem.songID, Validators.required),
      ministerName: new FormControl('', Validators.required),
      artistName: new FormControl(songListItem.artistName, Validators.required),
      songTitle: new FormControl(songListItem.title, Validators.required),
    });

    const initialValue = scaleSongFormGroup.value;

    scaleSongFormGroup.valueChanges.subscribe((value) => {
      const getTypedKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;
      const keys = getTypedKeys(value);
      const hasChanged = keys.some((key) => {
        return initialValue[key] !== value[key];
      });

      this.hasFormChanged.set(songListItem.songID, hasChanged);
      this.canSubmit = this.hasChanged();
    });

    return scaleSongFormGroup;
  }
}
