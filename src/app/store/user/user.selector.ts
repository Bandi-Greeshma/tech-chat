import { createSelector } from '@ngrx/store';
import { AppState } from '../../shared/models/state.model';

//selectors r mapping funcs

export const getUserState = (state: AppState) => state.user;

export const getIfLoggedIn = createSelector(
  getUserState,
  (data) => data.isLoggedIn
);
