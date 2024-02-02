import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Login } from '../models/auth.model';
import { Register } from '../models/register.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../models/state.model';
import { loadUser } from '../../store/user/user.action';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  isloggedIn: boolean = false;

  login(payload: Login) {
    this.http.post('auth', 'login', payload).subscribe({
      next: (response: any) => {
        // console.log(response);
        // this.isloggedIn = true;
        this.store.dispatch(loadUser({ payload: response.data }));
        this.router.navigate(['']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  register(payload: Register) {
    this.http.post('auth', 'register', payload).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['login']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
