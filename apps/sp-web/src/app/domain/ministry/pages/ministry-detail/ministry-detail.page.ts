import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MinistryListItemResponse } from '@sp/shared-interfaces';

import { combineLatest, map, Observable, of, switchMap, take } from 'rxjs';
import { MinistryService } from '../../services/ministry.service';

@Component({
  templateUrl: './ministry-detail.page.html',
  styleUrls: ['./ministry-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistryDetailPage implements OnInit {
  ministryListItem$: Observable<MinistryListItemResponse>;
  ministryID: number;

  constructor(public readonly ministryService: MinistryService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const param$ = this.activatedRoute.params.pipe(map(({ ministryID }) => +ministryID));
    const previousMinistriesListItems$ = this.ministryService.ministryListItems$;

    this.ministryListItem$ = combineLatest([param$, previousMinistriesListItems$]).pipe(
      take(1),
      switchMap(([id, ministriesListItems]) => {
        this.ministryID = id;
        const ministryListItem = ministriesListItems.find(({ ministryID }) => ministryID === id);

        if (ministryListItem) return of(ministryListItem);
        const ministryListItem$ = this.ministryService
          .getMinistryListItems(id)
          .pipe(map(([ministryListItem]) => ministryListItem));
        return ministryListItem$;
      })
    );
  }
}
