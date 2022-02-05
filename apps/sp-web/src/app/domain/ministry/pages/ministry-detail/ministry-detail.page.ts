import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { MinistryKeyRequest, MinistryListItemResponse } from '@sp/shared-interfaces';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, map, Observable, of, switchMap, take } from 'rxjs';
import {
    MinistryKeyDialogComponent
} from '../../components/ministry-key-dialog/ministry-key-dialog.component';
import { MinistryService } from '../../services/ministry.service';

@UntilDestroy()
@Component({
  templateUrl: './ministry-detail.page.html',
  styleUrls: ['./ministry-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinistryDetailPage implements OnInit {
  ministryListItem$: Observable<MinistryListItemResponse>;
  ministryID: number;

  constructor(
    public readonly ministryService: MinistryService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const param$ = this.activatedRoute.params.pipe(map(({ ministryID }) => +ministryID));
    const previousMinistriesListItems$ = this.ministryService.ministryListItems$;

    this.ministryListItem$ = combineLatest([param$, previousMinistriesListItems$]).pipe(
      take(1),
      switchMap(([id, ministriesListItems]) => {
        this.ministryID = id;
        const ministryListItem = ministriesListItems.find(({ ministryID }) => ministryID === id);

        if (ministryListItem) return of(ministryListItem);
        const ministryListItem$ = this.ministryService
          .getMinistryListItems(id)
          .pipe(map(([ministryListItem]) => ministryListItem));
        return ministryListItem$;
      })
    );
  }

  createMinistryKey(isKeyTabActive: boolean) {
    if (!isKeyTabActive) return;

    const dialogRef = this.dialog.open(MinistryKeyDialogComponent, {
      data: this.ministryID,
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result: MinistryKeyRequest) => {
        this.ministryService.createMinistryKey(this.ministryID, result).subscribe((ministryKey) => {
          console.log(ministryKey);
        });
      });
  }
}
