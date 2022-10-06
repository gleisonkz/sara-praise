import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
    eMinistryRole, MinisterSongRequest, ParticipantSelectItemResponse, SongKeyResponse
} from '@sp/shared-interfaces';
import { MinisterKeyDialogComponent } from '@sp/web/domain/ministry/components';
import { MinistryApiService } from '@sp/web/domain/ministry/services';
import { MinisterKeyDialogData } from '@sp/web/shared/functions';

import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
    injectMinisterSongDialogData
} from 'apps/sp-web/src/app/domain/scale/dialogs/minister-song/inject-minister-song-dialog-data';
import { ScaleApiService } from 'apps/sp-web/src/app/domain/scale/services/scale.api.service';
import { DEFAULT_MAT_DIALOG_CONFIG } from 'apps/sp-web/src/app/shared/constants/dialog-config';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { filter, map, Observable, skip, switchMap } from 'rxjs';

@UntilDestroy()
@Component({
  templateUrl: './minister-song.dialog.html',
  styleUrls: ['./minister-song.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatOptionModule,
    CommonModule,
    MatSelectModule,
    MatButtonModule,
    NgxMatSelectSearchModule,
    MatChipsModule,
  ],
})
export class MinisterSongDialog implements OnInit {
  constructor(
    private readonly ministryApiService: MinistryApiService,
    private readonly scaleApiService: ScaleApiService,
    private readonly dialogRef: MatDialogRef<MinisterSongDialog>,
    private readonly matDialog: MatDialog
  ) {}

  readonly TARGET_ROLES = [eMinistryRole.MINISTER];

  data = injectMinisterSongDialogData();
  keyIDControl = new FormControl<number | undefined>({ value: undefined, disabled: true }, Validators.required);

  ministryKeyForm: FormGroup<{
    memberID: FormControl<number>;
    songID: FormControl<number>;
    notation: FormControl<string>;
    scaleID: FormControl<number>;
  }>;

  searchCtrl: FormControl<string> = new FormControl();
  participantMinisters$: Observable<ParticipantSelectItemResponse[]>;

  sntKeys$: Observable<SongKeyResponse[]>;

  public get memberIdControl(): FormControl<number> {
    return this.ministryKeyForm.get('memberID');
  }

  public get songIdControl(): FormControl<number> {
    return this.ministryKeyForm.get('songID');
  }

  ngOnInit(): void {
    this.createForm();
    this.setMemberIdControlValueChanges();

    this.participantMinisters$ = this.scaleApiService.findAllParticipantsByRoleID(
      this.data.ministryID,
      this.data.scaleID,
      eMinistryRole.MINISTER
    );

    this.sntKeys$ = this.ministryApiService.getKeys(this.data.ministryID);

    this.ministryApiService
      .getMinisterSongKeyBySongID(this.data.ministryID, this.data.song.songID, this.data.song.memberID)
      .subscribe(({ songID, memberID, songKeyID: keyID }) => {
        this.ministryKeyForm.patchValue({ memberID, songID });
        this.keyIDControl.setValue(keyID);
      });
  }

  createForm() {
    this.ministryKeyForm = new FormGroup({
      memberID: new FormControl(this.data.song.memberID, Validators.required),
      songID: new FormControl({ value: this.data.song.songID, disabled: true }, Validators.required),
      notation: new FormControl({ value: '', disabled: true }, Validators.required),
      scaleID: new FormControl(this.data.scaleID, Validators.required),
    });
  }

  submitForm() {
    if (this.ministryKeyForm.invalid) return;
    const { memberID, songID, scaleID, notation } = this.ministryKeyForm.getRawValue();
    const ministerSongRequest: MinisterSongRequest = {
      memberID,
      notation,
    };

    this.scaleApiService.updateMinisterSong(this.data.ministryID, scaleID, songID, ministerSongRequest).subscribe({
      next: () => this.dialogRef.close(true),
    });
  }

  private setMemberIdControlValueChanges() {
    this.memberIdControl.valueChanges
      .pipe(
        untilDestroyed(this),
        skip(2),
        filter((memberID) => !!memberID),
        switchMap((memberID) => {
          return this.ministryApiService
            .hasMinisterSongKey(+this.data.ministryID, +memberID, +this.data.song.songID)
            .pipe(
              map((hasMinisterSongKey) => ({
                memberID,
                hasMinisterSongKey,
              }))
            );
        }),
        switchMap(({ memberID, hasMinisterSongKey }) => {
          if (hasMinisterSongKey)
            return this.ministryApiService.getMinisterSongKeyBySongID(
              this.data.ministryID,
              this.data.song.songID,
              memberID
            );

          const data: MinisterKeyDialogData = {
            ministryID: this.data.ministryID,
            memberID,
            songID: this.data.song.songID,
          };

          return this.matDialog
            .open(MinisterKeyDialogComponent, {
              data,
              ...DEFAULT_MAT_DIALOG_CONFIG,
            })
            .afterClosed();
        })
      )
      .subscribe(({ songKey, songKeyID }) => {
        this.keyIDControl.setValue(songKeyID);
        this.ministryKeyForm.patchValue({ notation: songKey });
      });
  }
}
