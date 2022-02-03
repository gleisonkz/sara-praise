import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ScaleDetailResponse } from '@sp/shared-interfaces';

import { MinistryService } from 'apps/sp-web/src/app/domain/ministry/services/ministry.service';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  templateUrl: './scale-detail.page.html',
  styleUrls: ['./scale-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaleDetailPage implements OnInit {
  constructor(private readonly activatedRoute: ActivatedRoute, private readonly ministryService: MinistryService) {}
  scaleListItem$: Observable<ScaleDetailResponse>;

  ngOnInit(): void {
    this.scaleListItem$ = this.activatedRoute.params.pipe(
      map(({ scaleID }) => +scaleID),
      switchMap((scaleID) => this.ministryService.getScaleListItemDetails(scaleID))
    );
  }
}
