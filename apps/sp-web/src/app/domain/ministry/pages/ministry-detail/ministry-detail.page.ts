import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { MinistryKeyRequest, MinistryListItemResponse } from '@sp/shared-interfaces';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, filter, map, Observable, of, switchMap, take } from 'rxjs';
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
    private readonly router: Router,
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

  goToCreateScale() {
    this.router.navigate(['escalas', 'create'], { relativeTo: this.activatedRoute });
  }

  goToCreateMusic() {
    console.log('createMusic');
  }

  goToCreateMinistryMember() {
    console.log('createMinistryMember');
  }

  goToCreateMinistryKey() {
    const dialogRef = this.dialog.open(MinistryKeyDialogComponent, {
      data: this.ministryID,
      width: '100%',
      maxWidth: '600px',
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe((result: MinistryKeyRequest) => {
        this.ministryService.createMinistryKey(this.ministryID, result).subscribe((ministryKey) => {
          console.log(ministryKey);
        });
      });
  }
}
