import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MinistryListItemResponse, ScaleDetailResponse } from '@sp/shared-interfaces';
import { injectMinistryID, injectRouteParam } from '@sp/web/shared/functions';
import { MinistryStore, ScaleStore } from '@sp/web/shared/stores';
import { SongListItemComponent } from '@sp/web/widget/components';

import {
    ConfirmDialogComponent, ConfirmDialogData
} from 'apps/sp-web/src/app/widget/components/confirm-dialog/confirm-dialog';
import { filter, Observable } from 'rxjs';

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
    ConfirmDialogComponent,
    MatDialogModule,
  ],
})
export class ScaleViewPage implements OnInit {
  scaleListItem$: Observable<ScaleDetailResponse>;
  ministry$: Observable<MinistryListItemResponse>;

  readonly ministryID = injectMinistryID();
  readonly scaleID = injectRouteParam('scaleID');

  constructor(
    private readonly ministryStore: MinistryStore,
    private readonly scaleStore: ScaleStore,
    private readonly matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.ministry$ = this.ministryStore.selectCurrentMinistry();
    this.scaleListItem$ = this.scaleStore.selectScaleDetail(this.ministryID, this.scaleID);
  }

  deleteScale() {
    this.matDialog
      .open<ConfirmDialogComponent, ConfirmDialogData>(ConfirmDialogComponent, {
        data: {
          title: 'Você tem certeza que deseja excluir esta escala?',
          message: 'Esta ação não pode ser desfeita.',
        },
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.scaleStore.remove(this.ministryID, this.scaleID));
  }
}
