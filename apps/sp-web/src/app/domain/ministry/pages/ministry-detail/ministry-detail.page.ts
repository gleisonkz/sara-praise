import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MinistryListItemResponse } from '@sp/shared-interfaces';

import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { MinistryService } from '../../services/ministry.service';

@Component({
  templateUrl: './ministry-detail.page.html',
  styleUrls: ['./ministry-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistryDetailPage implements OnInit {
  ministryListItem$: Observable<MinistryListItemResponse>;
  ministryID: number;

  links = ['escalas', 'musicas', 'membros', 'tonalidades'];
  activeLink: string;

  constructor(
    public readonly ministryService: MinistryService,
    private activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const param$ = this.activatedRoute.params.pipe(map(({ id }) => +id));

    const url = this.router.url.split('/');
    this.activeLink = url[url.length - 1];

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
