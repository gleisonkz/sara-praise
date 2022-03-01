import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { MinistryListItemResponse } from '@sp/shared-interfaces';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MinistryFacade } from 'apps/sp-web/src/app/domain/ministry/abstraction/minitries.facade';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import {
    MinistryKeyDialogComponent
} from '../../components/ministry-key-dialog/ministry-key-dialog.component';

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
    private readonly ministryFacade: MinistryFacade,
    private activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const param$ = this.activatedRoute.params.pipe(map(({ ministryID }) => +ministryID));
    const ministry$ = this.ministryFacade.ministry$;

    this.ministryListItem$ = combineLatest([param$, ministry$]).pipe(
      untilDestroyed(this),
      switchMap(([ministryID, ministry]) => {
        this.ministryID = ministryID;

        if (ministry) return of(ministry);
        return this.ministryFacade.getMinistryByID(ministryID);
      })
    );
  }

  deleteMinistry(ministryID: number) {
    this.ministryFacade.removeMinistry(ministryID);
    this.router.navigate(['/ministerios']);
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

    // dialogRef
    //   .afterClosed()
    //   .pipe(untilDestroyed(this), filter(Boolean))
    //   .subscribe((result: MinistryKeyRequest) => {
    //     this.ministryService.createMinistryKey(this.ministryID, result).subscribe((ministryKey) => {
    //       console.log(ministryKey);
    //     });
    //   });
  }
}
