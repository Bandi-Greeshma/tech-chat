import { createReducer, on } from '@ngrx/store';
import { UserState } from '../../shared/models/state.model';
import { loadUser, setLogInStatus } from './user.action';

const initialState: UserState = {
  _id: '',
  username: '',
  email: '',
  dp: '',
  status: '',
  isLoggedIn: false,
};
//1.reducer created by createReducer function.1st arg will be the type of data that will be handled by reducer
export const userReducer = createReducer(
  initialState,
  on(setLogInStatus, (state, action) => {
    return { ...state, isLoggedIn: action.payload };
  }),
  on(loadUser, (_, action) => {
    return { ...action.payload, isLoggedIn: true };
  })
);

//  {
//       _id: action.payload._id,
//       username: action.payload.username,
//       email: action.payload.email,
//       dp: action.payload.dp,
//       status: action.payload.status,
//       isLoggedIn: true,
//     };
