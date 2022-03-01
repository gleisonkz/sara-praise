import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ScaleDetailResponse } from '@sp/shared-interfaces';

import { HotToastService } from '@ngneat/hot-toast';
import {
    MinistryService
} from 'apps/sp-web/src/app/domain/ministry/core/services/ministry.service';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  templateUrl: './scale-view.page.html',
  styleUrls: ['./scale-view.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScaleViewPage implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly toastService: HotToastService,

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

  deleteScale() {
    this.ministryService.deleteScale(this.scaleID).subscribe(() => {
      this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
      this.toastService.success(`Escala apagada com sucesso!`);
    });
  }
}
