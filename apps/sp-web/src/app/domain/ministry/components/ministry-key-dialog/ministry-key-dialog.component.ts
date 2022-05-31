import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
    AvailableSongResponse, eMinistryRole, KeyResponse, MemberListItemResponse,
    MinisterSongKeyRequest
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
})
export class MinistryKeyDialogComponent implements OnInit {
  constructor(
    private readonly memberService: MemberApiService,
    public readonly ministryService: MinistryApiService,
    @Inject(MAT_DIALOG_DATA) private ministryID: number
  ) {}

  ministryKeyForm: FormGroup<ControlsOf<MinisterSongKeyRequest>>;

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
    this.createForm();
    const roles = [eMinistryRole.MINISTER];

    this.sntKeys$ = this.ministryService.getKeys();
    this.ministerMembers$ = this.memberService.getMemberListItems(this.ministryID, roles);

    this.memberIdControl.valueChanges
      .pipe(
        filter((id) => !!id),
        tap(() => this.songIdControl.reset()),
        switchMap((memberId) => this.ministryService.getAvailableSongListItems(this.ministryID, memberId))
      )
      .subscribe(this.songs$);
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
    return this.ministryKeyForm.value;
  }
}
