import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
    KeyResponse, MemberListItemResponse, MinistryKeyRequest, SongListItemResponse
} from '@sp/shared-interfaces';

import { ControlsOf, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Observable } from 'rxjs';
import { MinistryService } from '../../services/ministry.service';

@Component({
  selector: 'sp-ministry-key-dialog',
  templateUrl: './ministry-key-dialog.component.html',
  styleUrls: ['./ministry-key-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistryKeyDialogComponent implements OnInit {
  constructor(public readonly ministryService: MinistryService, @Inject(MAT_DIALOG_DATA) private id: number) {}

  ministryKeyForm: FormGroup<ControlsOf<MinistryKeyRequest>>;
  sntListMembers$: Observable<MemberListItemResponse[]>;
  sntListSongs$: Observable<SongListItemResponse[]>;
  sntKeys$: Observable<KeyResponse[]>;

  ngOnInit(): void {
    this.createForm();
    this.sntKeys$ = this.ministryService.getKeys();
    this.sntListMembers$ = this.ministryService.getMemberListItems(this.id);
    this.sntListSongs$ = this.ministryService.getSongListItems(this.id);
  }

  createForm(member?: number, song?: number, key?: number) {
    console.log('createForm', member, song, key);
    this.ministryKeyForm = new FormGroup({
      memberID: new FormControl(member, Validators.required),
      songID: new FormControl(song, Validators.required),
      keyID: new FormControl(key, Validators.required),
    });
  }

  submitForm() {
    if (this.ministryKeyForm.invalid) return;

    return this.ministryKeyForm.value;
  }
}
