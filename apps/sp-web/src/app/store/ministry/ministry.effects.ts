import { Injectable } from '@angular/core';

import {
    createMinistry, createMinistrySuccess, loadMinistryListItems, loadMinistryListItemsFailure,
    loadMinistryListItemsSuccess
} from '@sp/store/ministry/actions';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MinistryService } from 'apps/sp-web/src/app/domain/ministry/services/ministry.service';
import { catchError, concatMap, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MinistryListItemEffects {
  constructor(private actions$: Actions, private ministryService: MinistryService) {}

  loadMinistryListItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMinistryListItems),
      switchMap(() => {
        return this.ministryService.getMinistryListItems().pipe(
          map((ministryListItems) => loadMinistryListItemsSuccess({ ministryListItems })),
          catchError((error) => of(loadMinistryListItemsFailure({ error })))
        );
      })
    )
  );

  createMinistry$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createMinistry),
      concatMap(({ ministry }) => {
        return this.ministryService
          .createMinistry(ministry)
          .pipe(map((ministry) => createMinistrySuccess({ ministry })));
      })
    );
  });
}
