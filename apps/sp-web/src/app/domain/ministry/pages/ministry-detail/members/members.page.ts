import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MemberListItemResponse } from '@sp/shared-interfaces';

import {
    MinistryDetailRouteService
} from 'apps/sp-web/src/app/domain/ministry/services/ministry-detail-route.service';
import { MinistryService } from 'apps/sp-web/src/app/shared/services';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersPage {
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
