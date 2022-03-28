import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MemberListItemResponse } from '@sp/shared-interfaces';

import { MemberFacade } from 'apps/sp-web/src/app/domain/ministry/abstraction/members.facade';
import { Observable } from 'rxjs';
import { MinistryDetailRouteService } from '../../../core/services/ministry-detail-route.service';

@Component({
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersPage implements OnInit {
  memberListItems$: Observable<MemberListItemResponse[]>;

  constructor(
    private readonly ministryDetailRouteService: MinistryDetailRouteService,
    private readonly memberFacade: MemberFacade,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.memberListItems$ = this.memberFacade.members$;
    const ministryID = this.ministryDetailRouteService.getMinistryID(this.activatedRoute);
    this.memberFacade.getMembers(ministryID);
  }
}
