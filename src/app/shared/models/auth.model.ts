export interface Login {
  userName: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  data: {
    _id: string;
    username: string;
    email: string;
    dp: string;
    status: string;
  };
}

export interface Register {
  username: string;
  email: string;
  password: string;
}
