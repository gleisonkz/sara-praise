import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MinistryListItemResponse } from '@sp/shared-interfaces';

import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { MinistryService } from '../../ministry.service';

@Component({
  templateUrl: './ministry-detail.page.html',
  styleUrls: ['./ministry-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistryDetailPage implements OnInit {
  ministryListItem$: Observable<MinistryListItemResponse>;
  ministryID: number;

  links = ['escalas', 'musicas', 'membros', 'tonalidades'];

  activeLink = this.links[0];

  constructor(public readonly ministryService: MinistryService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const param$ = this.activatedRoute.params.pipe(map(({ id }) => +id));
    const previousMinistriesListItems$ = this.ministryService.ministryListItems$;

    this.ministryListItem$ = combineLatest([param$, previousMinistriesListItems$]).pipe(
      switchMap(([id, ministriesListItems]) => {
        this.ministryID = id;
        const ministryListItem = ministriesListItems.find(({ ministryID }) => ministryID === id);

        if (ministryListItem) return of(ministryListItem);
        return this.ministryService.getMinistryListItems(id).pipe(map(([ministry]) => ministry));
      })
    );
  }
}
