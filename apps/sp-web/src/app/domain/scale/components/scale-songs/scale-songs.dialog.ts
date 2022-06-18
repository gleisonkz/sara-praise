import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
    AvailableScaleSongResponse, eMinistryRole, ParticipantSelectItemResponse
} from '@sp/shared-interfaces';
import { SpForDirective } from '@sp/web/widget/directives';

import { FormArray } from '@ngneat/reactive-forms';
import {
    injectBaseDialogData
} from 'apps/sp-web/src/app/domain/scale/pages/scale-create-edit/inject.base-dialog-data.function';
import { ScaleApiService } from 'apps/sp-web/src/app/domain/scale/services/scale.api.service';
import { DisableControlDirective } from 'apps/sp-web/src/app/widget/directives/disable-control';
import {
    SetOnSelectValueRefDirective
} from 'apps/sp-web/src/app/widget/directives/set-on-select-value-ref/set-on-select-value-ref.directive';
import {
    SetOnSelectDirective
} from 'apps/sp-web/src/app/widget/directives/set-on-select/set-on-select.directive';
import { Observable, shareReplay, tap } from 'rxjs';

@Component({
  templateUrl: './scale-songs.dialog.html',
  styleUrls: ['./scale-songs.dialog.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    DisableControlDirective,
    SpForDirective,
    SetOnSelectDirective,
    SetOnSelectValueRefDirective,
  ],
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
