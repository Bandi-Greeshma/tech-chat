export interface UserState {
  _id: string;
  username: string;
  email: string;
  dp: string;
  status: string;
  isLoggedIn: boolean;
}

//here we give all our reducers types
export interface AppState {
  user: UserState;
}
