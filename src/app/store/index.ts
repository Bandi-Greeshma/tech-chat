import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../shared/models/state.model';
import { userReducer } from './user/user.reducer';

//this reducerMap holds all the reducers of the store
//ActionReducerMap is just a map object of all reducers
export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
};
