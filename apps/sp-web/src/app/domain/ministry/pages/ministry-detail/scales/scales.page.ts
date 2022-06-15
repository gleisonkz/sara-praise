/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ScaleListItemResponse } from '@sp/shared-interfaces';

import {
    ScaleApiService
} from 'apps/sp-web/src/app/domain/ministry/core/services/scale.api.service';
import { injectMinistryID } from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.inject';
import { FADE_ANIMATION } from 'apps/sp-web/src/app/shared/animations/fade.animation';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './scales.page.html',
  styleUrls: ['./scales.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [FADE_ANIMATION],
})
export class ScalesPage implements OnInit {
  scaleListItems$: Observable<ScaleListItemResponse[]>;
  readonly ministryID = injectMinistryID();

  constructor(private readonly scaleApiService: ScaleApiService) {}
  ngOnInit(): void {
    this.scaleListItems$ = this.scaleApiService.getScaleListItems(+this.ministryID);
  }
}
