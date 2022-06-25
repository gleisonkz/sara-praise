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

import { ControlsOf, FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
    MemberApiService
} from 'apps/sp-web/src/app/domain/ministry/core/services/member.api.service';
import { BehaviorSubject, filter, Observable, switchMap, tap } from 'rxjs';
import { MinistryApiService } from '../../core/services/ministry.api.service';

@Component({
  templateUrl: './ministry-key-dialog.component.html',
  styleUrls: ['./ministry-key-dialog.component.scss'],
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
export class MinistryKeyDialogComponent implements OnInit {
  constructor(
    private readonly memberService: MemberApiService,
    public readonly ministryApiService: MinistryApiService,
    private readonly dialogRef: MatDialogRef<MinistryKeyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { ministryID: number; memberID?: number; songID?: number }
  ) {}

  ministryKeyForm: FormGroup<ControlsOf<IMinisterSongKeyRequest>>;

  ministerMembers$: Observable<MemberListItemResponse[]>;
  songs$ = new BehaviorSubject<AvailableSongResponse[]>([]);
  sntKeys$: Observable<KeyResponse[]>;

  public get memberIdControl(): FormControl<number> {
    return (this.ministryKeyForm.controls as any).memberID;
  }

  public get songIdControl(): FormControl<number> {
    return (this.ministryKeyForm.controls as any).songID;
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

    this.ministryApiService.createMinisterSongKey(this.data.ministryID, ministerSongKeyRequest).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.ministryKeyForm.reset();
      },
    });
  }
}
