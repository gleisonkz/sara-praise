import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MemberListItemResponse } from '@sp/shared-interfaces';

import { Observable } from 'rxjs';
import { MinistryDetailRouteService } from '../../../services/ministry-detail-route.service';
import { MinistryService } from '../../../services/ministry.service';

@Component({
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersPage implements OnInit {
  memberListItems$: Observable<MemberListItemResponse[]>;

  constructor(
    private readonly ministryDetailRouteService: MinistryDetailRouteService,
    private readonly ministryService: MinistryService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const ministryID = this.ministryDetailRouteService.getMinistryID(this.activatedRoute);
    this.memberListItems$ = this.ministryService.getMemberListItems(+ministryID);
  }
}
