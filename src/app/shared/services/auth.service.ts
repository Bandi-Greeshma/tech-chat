import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Login, LoginResponse } from '../models/auth.model';
import { Register } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpService, private router: Router) {}

  isloggedIn: boolean = false;

  login(payload: Login) {
    this.http.post<LoginResponse, Login>('auth', 'login', payload).subscribe({
      next: (response) => {
        console.log(response);
        this.isloggedIn = true;
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
