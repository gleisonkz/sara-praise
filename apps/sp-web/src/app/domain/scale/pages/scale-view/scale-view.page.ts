import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MinistryListItemResponse, ScaleDetailResponse } from '@sp/shared-interfaces';
import { SongListItemComponent } from '@sp/web/widget/components';

import { HotToastService } from '@ngneat/hot-toast';
import { injectMinistryID } from 'apps/sp-web/src/app/domain/ministry/providers/ministry-id.inject';
import { ScaleApiService } from 'apps/sp-web/src/app/domain/scale/services/scale.api.service';
import { MinistryStore } from 'apps/sp-web/src/app/shared/stores/ministry/ministry.store';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  templateUrl: './scale-view.page.html',
  styleUrls: ['./scale-view.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    RouterModule,
    MatMenuModule,
    CommonModule,
    MatDividerModule,
    MatTabsModule,
    MatListModule,
    SongListItemComponent,
    MatButtonModule,
  ],
})
export class ScaleViewPage implements OnInit {
  scaleListItem$: Observable<ScaleDetailResponse>;
  ministry$: Observable<MinistryListItemResponse>;
  readonly ministryID = injectMinistryID();
  scaleID: number;

  constructor(
    private readonly router: Router,
    private readonly toastService: HotToastService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly scaleApiService: ScaleApiService,
    private readonly ministryStore: MinistryStore
  ) {}

  ngOnInit(): void {
    this.ministry$ = this.ministryStore.selectCurrentMinistry();

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
