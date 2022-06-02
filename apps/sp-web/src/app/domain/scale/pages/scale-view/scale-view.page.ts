import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MinistryListItemResponse, ScaleDetailResponse } from '@sp/shared-interfaces';

import { HotToastService } from '@ngneat/hot-toast';
import { MinistryFacade } from 'apps/sp-web/src/app/domain/ministry/abstraction/ministry.facade';
import {
    MinistryApiService
} from 'apps/sp-web/src/app/domain/ministry/core/services/ministry.api.service';
import {
    MINISTRY_ID, MINISTRY_ID_PROVIDER
} from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.provider';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  templateUrl: './scale-view.page.html',
  styleUrls: ['./scale-view.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MINISTRY_ID_PROVIDER],
})
export class ScaleViewPage implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly toastService: HotToastService,
    private readonly ministryFacade: MinistryFacade,
    private readonly activatedRoute: ActivatedRoute,
    private readonly ministryService: MinistryApiService,
    @Inject(MINISTRY_ID) private readonly ministryID: number
  ) {}

  scaleListItem$: Observable<ScaleDetailResponse>;
  ministry$: Observable<MinistryListItemResponse>;
  scaleID: number;

  ngOnInit(): void {
    this.ministry$ = this.ministryFacade.ministry$;

    this.scaleListItem$ = this.activatedRoute.params.pipe(
      map(({ scaleID }) => {
        this.scaleID = scaleID;
        return +scaleID;
      }),
      switchMap((scaleID) => this.ministryService.getScaleListItemDetails(this.ministryID, scaleID))
    );
  }

  deleteScale() {
    this.ministryService.deleteScale(this.scaleID).subscribe(() => {
      this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
      this.toastService.success(`Escala apagada com sucesso!`);
    });
  }
}
