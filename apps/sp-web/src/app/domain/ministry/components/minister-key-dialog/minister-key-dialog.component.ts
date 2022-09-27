import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
    AvailableSongResponse, eMinistryRole, IMinisterSongKeyRequest, MemberListItemResponse,
    SongKeyResponse
} from '@sp/shared-interfaces';
import { MemberApiService, MinistryApiService } from '@sp/web/domain/ministry/services';
import { eDialogMode, injectMinisterKeyDialogData } from '@sp/web/shared/functions';
import { MinisterSongKeyStore } from '@sp/web/shared/stores';

import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
    toLowerCaseWithoutAccents
} from 'apps/sp-web/src/app/shared/functions/utilities/utilities.function';
import { Optional } from 'apps/sp-web/src/app/shared/types/nullable.type';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { BehaviorSubject, filter, map, Observable, ReplaySubject, switchMap, tap } from 'rxjs';

@UntilDestroy()
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
    NgxMatSelectSearchModule,
  ],
})
export class MinisterKeyDialogComponent implements OnInit {
  constructor(
    private readonly memberService: MemberApiService,
    private readonly ministryApiService: MinistryApiService,
    private readonly ministerSongKeyStore: MinisterSongKeyStore,
    private readonly dialogRef: MatDialogRef<MinisterKeyDialogComponent>
  ) {}

  readonly TARGET_ROLES = [eMinistryRole.MINISTER];

  data = injectMinisterKeyDialogData();
  ministryKeyForm: FormGroup<{
    memberID: FormControl<Optional<number>>;
    songID: FormControl<Optional<number>>;
    keyID: FormControl<Optional<number>>;
  }>;

  searchCtrl: FormControl<string> = new FormControl();

  ministerMembers$: Observable<MemberListItemResponse[]>;
  sntKeys$: Observable<SongKeyResponse[]>;
  songs$ = new BehaviorSubject<AvailableSongResponse[]>([]);
  filteredSongs$: ReplaySubject<AvailableSongResponse[]> = new ReplaySubject<AvailableSongResponse[]>(1);

  public get memberIdControl(): FormControl<number> {
    const memberID = this.ministryKeyForm.get('memberID');
    return memberID as FormControl<number>;
  }

  public get songIdControl(): FormControl<number> {
    const songID = this.ministryKeyForm.get('songID');
    return songID as FormControl<number>;
  }

  ngOnInit(): void {
    this.createForm(this.data.memberID, this.data.songID);
    this.ministerMembers$ = this.getMinisterMembers();

    this.sntKeys$ = this.ministryApiService.getKeys(this.data.ministryID);

    this.setMemberIdControlValueChanges();
    this.setSearchControlValueChanges();
  }

  createForm(ministerID?: Optional<number>, songID?: Optional<number>, keyID?: Optional<number>) {
    const shouldDisable = this.data.mode === eDialogMode.EDIT;

    this.ministryKeyForm = new FormGroup({
      memberID: new FormControl({ value: ministerID, disabled: shouldDisable }, Validators.required),
      songID: new FormControl({ value: songID, disabled: shouldDisable }, Validators.required),
      keyID: new FormControl(keyID, Validators.required),
    });
  }

  submitForm() {
    if (this.ministryKeyForm.invalid) return;
    const ministerSongKeyRequest = this.ministryKeyForm.value as IMinisterSongKeyRequest;

    this.ministerSongKeyStore.create(this.data.ministryID, ministerSongKeyRequest).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.ministryKeyForm.reset();
      },
    });
  }

  private getMinisterMembers(): Observable<MemberListItemResponse[]> {
    if (this.data.memberID)
      return this.memberService.findByID(this.data.ministryID, this.data.memberID).pipe(map((member) => [member]));
    return this.memberService.findAll(this.data.ministryID, this.TARGET_ROLES);
  }

  private setMemberIdControlValueChanges() {
    this.memberIdControl.valueChanges
      .pipe(
        untilDestroyed(this),
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

  private setSearchControlValueChanges() {
    this.searchCtrl.valueChanges
      .pipe(
        untilDestroyed(this),
        filter((searchValue) => !!searchValue),
        map((searchValue) => toLowerCaseWithoutAccents(searchValue))
      )
      .subscribe((searchValue) => {
        const songs = this.songs$.value;

        const filteredSongs = songs.filter(
          ({ title, artistName }) =>
            toLowerCaseWithoutAccents(title).includes(searchValue) ||
            toLowerCaseWithoutAccents(artistName).includes(searchValue)
        );

        this.filteredSongs$.next(filteredSongs);
      });
  }
}
