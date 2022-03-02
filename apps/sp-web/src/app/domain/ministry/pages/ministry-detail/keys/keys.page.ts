import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MinistryKeyListItemResponse } from '@sp/shared-interfaces';

import { Observable, of } from 'rxjs';
import { MinistryDetailRouteService } from '../../../core/services/ministry-detail-route.service';
import { MinistryService } from '../../../core/services/ministry.service';

@Component({
  templateUrl: './keys.page.html',
  styleUrls: ['./keys.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeysPage implements OnInit {
  keysListItems$: Observable<MinistryKeyListItemResponse[]> = of([]);
  constructor(
    private readonly ministryDetailRouteService: MinistryDetailRouteService,
    private readonly ministryService: MinistryService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const ministryID = this.ministryDetailRouteService.getMinistryID(this.activatedRoute);

    // this.keysListItems$ = this.ministryService.ministryKeyListItems$;
    // this.ministryService.getKeyListItem(ministryID).subscribe();
  }
}
