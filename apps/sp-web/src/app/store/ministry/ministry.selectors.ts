import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectMinistryListItems = (state: AppState) => state.ministryListItems;

export const selectAllMinistryListItems = createSelector(selectMinistryListItems, (state) => state);

export const selectMinistryListItemByID = (id: number) =>
  createSelector(selectMinistryListItems, (ministryListItems) =>
    ministryListItems.find(({ ministryID }) => ministryID === id)
  );
