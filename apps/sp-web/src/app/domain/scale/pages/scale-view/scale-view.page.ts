import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MinistryListItemResponse, ScaleDetailResponse } from '@sp/shared-interfaces';

import { HotToastService } from '@ngneat/hot-toast';
import { MinistryFacade } from 'apps/sp-web/src/app/domain/ministry/abstraction/ministry.facade';
import {
    ScaleApiService
} from 'apps/sp-web/src/app/domain/ministry/core/services/scale.api.service';
import { injectMinistryID } from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.inject';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  templateUrl: './scale-view.page.html',
  styleUrls: ['./scale-view.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaleViewPage implements OnInit {
  scaleListItem$: Observable<ScaleDetailResponse>;
  ministry$: Observable<MinistryListItemResponse>;
  readonly ministryID = injectMinistryID();
  scaleID: number;

  constructor(
    private readonly router: Router,
    private readonly toastService: HotToastService,
    private readonly ministryFacade: MinistryFacade,
    private readonly activatedRoute: ActivatedRoute,
    private readonly scaleApiService: ScaleApiService
  ) {}

  ngOnInit(): void {
    this.ministry$ = this.ministryFacade.ministry$;

    this.scaleListItem$ = this.activatedRoute.params.pipe(
      map(({ scaleID }) => {
        this.scaleID = scaleID;
        return +scaleID;
      }),
      switchMap((scaleID) => this.scaleApiService.getScaleListItemDetails(this.ministryID, scaleID))
    );
  }

  deleteScale() {
    this.scaleApiService.delete(this.scaleID).subscribe(() => {
      this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
      this.toastService.success(`Escala apagada com sucesso!`);
    });
  }
}
