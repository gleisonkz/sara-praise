import { MinistryListItemResponse, MinistryRequest } from '@sp/shared-interfaces';

import { createAction, props } from '@ngrx/store';

export const createMinistry = createAction('[Ministries Page] Create Ministry', props<{ ministry: MinistryRequest }>());
export const deleteMinistry = createAction('[Ministries Page] Delete Ministry', props<{ ministryID: number }>());
export const loadMinistryListItems = createAction('[Ministries Page] Load Ministry List Items');

export const createMinistrySuccess = createAction(
  '[Ministry API] Create Ministry Success',
  props<{ ministry: MinistryListItemResponse }>()
);

export const createMinistryFailure = createAction('[Ministry API] Create Ministry Failure', props<{ error: any }>());

export const deleteMinistrySuccess = createAction(
  '[Ministry API] Delete Ministry Success',
  props<{ ministryID: number }>()
);

export const deleteMinistryFailure = createAction('[Ministry API] Delete Ministry Failure', props<{ error: any }>());

export const loadMinistryListItemsSuccess = createAction(
  '[Ministry API] Load Ministry List Items Success',
  props<{ ministryListItems: MinistryListItemResponse[] }>()
);

export const loadMinistryListItemsFailure = createAction(
  '[Ministry API] Load Ministry List Items Failure',
  props<{ error: string }>()
);
