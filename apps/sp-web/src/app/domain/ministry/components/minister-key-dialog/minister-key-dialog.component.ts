import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
    AvailableSongResponse, eMinistryRole, IMinisterSongKeyRequest, KeyResponse,
    MemberListItemResponse
} from '@sp/shared-interfaces';
import { MemberApiService, MinistryApiService } from '@sp/web/domain/ministry/services';
import { MinisterSongKeyStore } from '@sp/web/shared/stores';

import { ControlsOf, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { BehaviorSubject, filter, Observable, switchMap, tap } from 'rxjs';

@Component({
  templateUrl: './minister-key-dialog.component.html',
  styleUrls: ['./minister-key-dialog.component.scss'],
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
  ],
})
export class MinisterKeyDialogComponent implements OnInit {
  constructor(
    private readonly memberService: MemberApiService,
    private readonly ministryApiService: MinistryApiService,
    private readonly ministerSongKeyStore: MinisterSongKeyStore,
    private readonly dialogRef: MatDialogRef<MinisterKeyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { ministryID: number; memberID?: number; songID?: number }
  ) {}

  ministryKeyForm: FormGroup<ControlsOf<IMinisterSongKeyRequest>>;

  ministerMembers$: Observable<MemberListItemResponse[]>;
  songs$ = new BehaviorSubject<AvailableSongResponse[]>([]);
  sntKeys$: Observable<KeyResponse[]>;

  public get memberIdControl(): FormControl<number> {
    return this.ministryKeyForm.controls.memberID;
  }

  public get songIdControl(): FormControl<number> {
    return this.ministryKeyForm.controls.songID;
  }

  ngOnInit(): void {
    this.createForm(this.data.memberID, this.data.songID);
    const roles = [eMinistryRole.MINISTER];

    this.sntKeys$ = this.ministryApiService.getKeys();
    this.ministerMembers$ = this.memberService.findAll(this.data.ministryID, roles);

    this.memberIdControl.valueChanges
      .pipe(
        filter((id) => !!id),
        tap(() => this.songIdControl.reset()),
        switchMap((memberId) =>
          this.ministryApiService.getAvailableSongListItems(this.data.ministryID, memberId, this.data.songID)
        )
      )
      .subscribe((songs) => {
        this.songs$.next(songs);
        if (!this.data.songID) return;
        this.songIdControl.setValue(this.data.songID);
      });
  }

  createForm(ministerID?: number, songID?: number, keyID?: number) {
    this.ministryKeyForm = new FormGroup({
      memberID: new FormControl(ministerID, Validators.required),
      songID: new FormControl(songID, Validators.required),
      keyID: new FormControl(keyID, Validators.required),
    });
  }

  submitForm() {
    if (this.ministryKeyForm.invalid) return;
    const ministerSongKeyRequest = this.ministryKeyForm.value;

    this.ministerSongKeyStore.create(this.data.ministryID, ministerSongKeyRequest).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.ministryKeyForm.reset();
      },
    });
  }
}
