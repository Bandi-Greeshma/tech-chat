import { CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';

//auto login
export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const router = inject(Router);
  const http = inject(HttpService);
  const auth = inject(AuthService);

  return new Observable((subscriber) => {
    if (auth.isloggedIn) return subscriber.next(true);

    http.get('user', 'fetch').subscribe({
      next: (data) => {
        subscriber.next(true);
      },
      error: (err) => {
        router.navigate(['login'], { skipLocationChange: true });
        subscriber.next(false);
      },
    });
  });
};
