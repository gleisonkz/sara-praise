/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ScaleListItemResponse } from '@sp/shared-interfaces';

import {
    MinistryDetailRouteService
} from 'apps/sp-web/src/app/domain/ministry/services/ministry-detail-route.service';
import { MinistryService } from 'apps/sp-web/src/app/shared/services';
import { Observable, of } from 'rxjs';

export const SCALE_LISTE_ITEMS_MOCK: ScaleListItemResponse[] = [
  {
    scaleID: 1,
    title: 'Arena',
    notes: 'Teste de observação',
    songsQuantity: 2,
    date: new Date(),
    imagesUrl: ['https://randomuser.me/api/portraits/men/92.jpg', 'https://randomuser.me/api/portraits/men/52.jpg'],
  },
  {
    scaleID: 2,
    title: 'Celebração de Inverno',
    notes: 'Teste de observação',
    songsQuantity: 5,
    date: new Date(),
    imagesUrl: ['https://randomuser.me/api/portraits/men/32.jpg'],
  },
];

@Component({
  templateUrl: './scales.page.html',
  styleUrls: ['./scales.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScalesPage implements OnInit {
  scaleListItems$: Observable<ScaleListItemResponse[]> = of(SCALE_LISTE_ITEMS_MOCK);

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
