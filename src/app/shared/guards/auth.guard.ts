import { CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../models/state.model';
import { getIfLoggedIn } from '../../store/user/user.selector';

//auto login
export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const router = inject(Router);
  const http = inject(HttpService);
  const store = inject(Store<AppState>);
  let loggedIn: boolean;

  //store operates with observables
  // store
  //   .subscribe((state: AppState) => {
  //     // console.log(state);
  //     loggedIn = state.user.isLoggedIn;
  //   })
  //   .unsubscribe();

  // store
  //   .select('user')
  //   .subscribe((state) => {
  //     loggedIn = state.isLoggedIn;
  //   })
  //   .unsubscribe();

  store.select(getIfLoggedIn).subscribe((data) => (loggedIn = data));

  return new Observable((subscriber) => {
    if (loggedIn) return subscriber.next(true);

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
