import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
    eMinistryRole, KeyResponse, MemberListItemResponse, MinistryKeyRequest, SongListItemResponse
} from '@sp/shared-interfaces';

import { ControlsOf, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { BehaviorSubject, filter, Observable, switchMap, tap } from 'rxjs';
import { MinistryService } from '../../services/ministry.service';

@Component({
  templateUrl: './ministry-key-dialog.component.html',
  styleUrls: ['./ministry-key-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistryKeyDialogComponent implements OnInit {
  constructor(public readonly ministryService: MinistryService, @Inject(MAT_DIALOG_DATA) private ministryID: number) {}

  ministryKeyForm: FormGroup<ControlsOf<MinistryKeyRequest>>;

  ministerMembers$: Observable<MemberListItemResponse[]>;
  songs$ = new BehaviorSubject<SongListItemResponse[]>([]);
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
    this.ministerMembers$ = this.ministryService.getMemberListItems(this.ministryID, roles);

    this.memberIdControl.valueChanges
      .pipe(
        filter((id) => !!id),
        tap(() => this.songIdControl.reset()),
        switchMap((memberId) => this.ministryService.getAvailableSongListItems(this.ministryID, memberId))
      )
      .subscribe(this.songs$);
  }

  createForm(memberID?: number, songID?: number, keyID?: number) {
    this.ministryKeyForm = new FormGroup({
      memberID: new FormControl(memberID, Validators.required),
      songID: new FormControl(songID, Validators.required),
      keyID: new FormControl(keyID, Validators.required),
    });
  }

  submitForm() {
    if (this.ministryKeyForm.invalid) return;

    return this.ministryKeyForm.value;
  }
}
