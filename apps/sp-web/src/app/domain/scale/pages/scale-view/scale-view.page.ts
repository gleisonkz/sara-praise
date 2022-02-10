import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ScaleDetailResponse } from '@sp/shared-interfaces';

import { MinistryService } from 'apps/sp-web/src/app/domain/ministry/services/ministry.service';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  templateUrl: './scale-view.page.html',
  styleUrls: ['./scale-view.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaleViewPage implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly ministryService: MinistryService
  ) {}

  scaleListItem$: Observable<ScaleDetailResponse>;
  scaleID: number;

  ngOnInit(): void {
    this.scaleListItem$ = this.activatedRoute.params.pipe(
      map(({ scaleID }) => {
        this.scaleID = scaleID;
        return +scaleID;
      }),
      switchMap((scaleID) => this.ministryService.getScaleListItemDetails(scaleID))
    );
  }
}
