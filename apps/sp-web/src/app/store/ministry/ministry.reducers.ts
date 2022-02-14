import { MinistryListItemResponse } from '@sp/shared-interfaces';

import { createReducer, on } from '@ngrx/store';
import {
    createMinistrySuccess, deleteMinistry, loadMinistryListItems, loadMinistryListItemsFailure,
    loadMinistryListItemsSuccess
} from './ministry.actions';

const createItem = (items: MinistryListItemResponse[], newItem: MinistryListItemResponse) => {
  return [...items, newItem];
};

const deleteItem = (items: MinistryListItemResponse[], ministryID: number) => {
  return items.filter((item) => item.ministryID !== ministryID);
};

export const INITIAL_STATE: MinistryListItemResponse[] = [];

export const ministryListItemReducer = createReducer(
  INITIAL_STATE,

  on(loadMinistryListItems, (state) => state),

  on(loadMinistryListItemsSuccess, (_, { ministryListItems }) => {
    return ministryListItems;
  }),

  on(loadMinistryListItemsFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(createMinistrySuccess, (state, { ministry }) => {
    return createItem(state, ministry);
  }),

  on(deleteMinistry, (state, { ministryID }) => {
    return deleteItem(state, ministryID);
  })
);
