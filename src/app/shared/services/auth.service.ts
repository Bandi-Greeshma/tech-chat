import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Login } from '../models/auth.model';
import { environment } from 'src/environment/environment';
import { catchError } from 'rxjs';
import { Register } from '../models/register.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpService, private router: Router) {}

  login(payload: Login) {
    this.http.post('auth', 'login', payload).subscribe({
      next: (response) => {
        console.log(response);
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
