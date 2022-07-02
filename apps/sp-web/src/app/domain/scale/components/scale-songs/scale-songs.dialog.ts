import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
    AvailableScaleSongResponse, eMinistryRole, ParticipantSelectItemResponse
} from '@sp/shared-interfaces';
import { MinisterKeyDialogComponent } from '@sp/web/domain/ministry/components';
import { MinistryApiService } from '@sp/web/domain/ministry/services';
import { SpForDirective } from '@sp/web/widget/directives';

import { FormArray } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
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
import { filter, Observable, of, shareReplay, switchMap, tap } from 'rxjs';

@UntilDestroy()
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
      ministerName: FormControl<string | null | undefined>;
      artistName: FormControl<string | null>;
      songTitle: FormControl<string | null>;
    }>
  > = new FormArray([]);

  hasFormChanged = new Map<number, boolean>();
  canSubmit: boolean;

  constructor(
    private readonly dialogRef: MatDialogRef<ScaleSongsDialog>,
    private readonly matDialog: MatDialog,
    private readonly scaleApiService: ScaleApiService,
    private readonly ministryApiService: MinistryApiService
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

          this.scaleSongFormArray.controls.forEach((scaleSongFormGroup) => {
            const ministerControl = scaleSongFormGroup.get('memberID');
            ministerControl?.valueChanges
              .pipe(
                switchMap((memberID) => {
                  const songID = scaleSongFormGroup.get('songID')?.value;
                  if (!songID || !memberID) return of(null);

                  return this.ministryApiService.hasMinisterSongKey(
                    +this.scaleDialogData.ministryID,
                    +memberID,
                    +songID
                  );
                }),
                filter((hasKey) => hasKey !== null)
              )
              .subscribe((hasMinisterSongKey) => {
                if (hasMinisterSongKey) return;

                this.matDialog
                  .open(MinisterKeyDialogComponent, {
                    data: {
                      ministryID: this.scaleDialogData.ministryID,
                      memberID: scaleSongFormGroup.get('memberID')?.value,
                      songID: scaleSongFormGroup.get('songID')?.value,
                    },
                  })
                  .afterClosed()
                  .pipe(untilDestroyed(this), filter(Boolean))
                  .subscribe((result) => {
                    console.log({ result });
                  });
              });
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
      memberID: new FormControl(songListItem.member?.memberID, Validators.required),
      scaleID: new FormControl(this.scaleDialogData.scaleID, Validators.required),
      songID: new FormControl(songListItem.songID, Validators.required),
      ministerName: new FormControl(songListItem.member?.memberName),
      artistName: new FormControl(songListItem.artistName, Validators.required),
      songTitle: new FormControl(songListItem.title, Validators.required),
    });

    const initialValue = scaleSongFormGroup.value;

    scaleSongFormGroup.valueChanges.subscribe((value) => {
      const getTypedKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;
      const keys = getTypedKeys(value);
      const hasChanged = keys.some((key) => {
        const initialValueValue = initialValue[key];
        const currentValue = value[key];

        return initialValueValue !== currentValue;
      });

      this.hasFormChanged.set(songListItem.songID, hasChanged);
      this.canSubmit = this.hasChanged() && this.scaleSongFormArray.valid;
    });

    return scaleSongFormGroup;
  }
}
