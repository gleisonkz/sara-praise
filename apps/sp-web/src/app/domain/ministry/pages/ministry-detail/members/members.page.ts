import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { MemberListItemResponse } from '@sp/shared-interfaces';

import { MemberFacade } from 'apps/sp-web/src/app/domain/ministry/abstraction/member.facade';
import {
    MINISTRY_ID, MINISTRY_ID_PROVIDER
} from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.provider';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MINISTRY_ID_PROVIDER],
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatMenuModule, MatListModule, MatButtonModule, CommonModule],
})
export class MembersPage implements OnInit, OnDestroy {
  memberListItems$: Observable<MemberListItemResponse[]>;

  constructor(private readonly memberFacade: MemberFacade, @Inject(MINISTRY_ID) private readonly ministryID: number) {}

  ngOnInit(): void {
    this.memberListItems$ = this.memberFacade.members$;
    this.memberFacade.getMembers(this.ministryID);
  }

  ngOnDestroy(): void {
    this.memberFacade.clearMembers();
  }
}
