import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MemberListItemResponse } from '@sp/shared-interfaces';
import { injectMinistryID } from '@sp/web/shared/functions';

import {
    MemberDialog
} from 'apps/sp-web/src/app/domain/ministry/components/member-dialog/member.dialog';
import { MemberStore } from 'apps/sp-web/src/app/shared/stores/member/member.store';
import {
    ImgFallbackDirective
} from 'apps/sp-web/src/app/widget/directives/img-fallback/img-fallback.directive';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatButtonModule,
    CommonModule,
    MatToolbarModule,
    ImgFallbackDirective,
  ],
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

  showDialog(memberID?: number): void {
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
