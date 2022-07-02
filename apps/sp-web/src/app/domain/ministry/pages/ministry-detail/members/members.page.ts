import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { MemberListItemResponse } from '@sp/shared-interfaces';

import {
    MemberDialog
} from 'apps/sp-web/src/app/domain/ministry/components/member-dialog/member.dialog';
import { injectMinistryID } from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.inject';
import {
    MINISTRY_ID_PROVIDER
} from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.provider';
import { MemberStore } from 'apps/sp-web/src/app/shared/stores/member/member.store';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MINISTRY_ID_PROVIDER],
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatMenuModule, MatListModule, MatButtonModule, CommonModule],
})
export class MembersPage implements OnInit {
  memberListItems$: Observable<MemberListItemResponse[]>;
  readonly ministryID = injectMinistryID();

  constructor(private readonly matDialog: MatDialog, private readonly memberStore: MemberStore) {}

  ngOnInit(): void {
    this.memberListItems$ = this.memberStore.findAll(this.ministryID);
  }

  removeMember(memberID: number): void {
    this.memberStore.remove(this.ministryID, memberID).subscribe();
  }

  editMember(memberID: number): void {
    this.matDialog.open(MemberDialog, {
      data: {
        ministryID: this.ministryID,
        memberID,
      },
      width: '100%',
      maxWidth: '600px',
      panelClass: 'member-dialog',
    });
  }
}
