/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ScaleListItemResponse } from '@sp/shared-interfaces';

import {
    MinistryDetailRouteService
} from 'apps/sp-web/src/app/domain/ministry/services/ministry-detail-route.service';
import { MinistryService } from 'apps/sp-web/src/app/shared/services';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './scales.page.html',
  styleUrls: ['./scales.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScalesPage implements OnInit {
  scaleListItems$: Observable<ScaleListItemResponse[]>;

  constructor(
    private readonly ministryDetailRouteService: MinistryDetailRouteService,
    private readonly ministryService: MinistryService,
    private readonly activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    const ministryID = this.ministryDetailRouteService.getMinistryID(this.activatedRoute);
    this.scaleListItems$ = this.ministryService.getScaleListItems(+ministryID);
  }
}
