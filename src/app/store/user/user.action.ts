import { createAction, props } from '@ngrx/store';

//action created by createAction function
//2.createAction returns an object
//props is function.props carry payload.props is a function which informs angular which type of data will be
export const setLogInStatus = createAction(
  '[USER] SET LOGIN STATUS',
  props<{ payload: boolean }>()
);

export const loadUser = createAction(
  '[USER] LOAD USER DATA',
  props<{
    payload: {
      _id: string;
      username: string;
      email: string;
      dp: string;
      status: string;
    };
  }>()
);
