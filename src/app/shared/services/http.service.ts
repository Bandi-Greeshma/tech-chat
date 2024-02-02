import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  urlConstructor(service: string, path: string) {
    return `${environment.protocol}://${environment.host}${environment.api[service][path]}`;
  }

  get<T extends object>(service: string, path: string) {
    const url = this.urlConstructor(service, path);
    return this.http.get<T>(url, { headers: {}, observe: 'response' }).pipe(
      map((response) => {
        return response.body;
      }),
      catchError((error: HttpErrorResponse) => throwError(() => error.error))
    );
  }

  post<T extends object, P extends object>(
    service: string,
    path: string,
    payload: P
  ) {
    const url = this.urlConstructor(service, path);
    return this.http
      .post<T>(url, payload, {
        observe: 'response',
        headers: {},
      })
      .pipe(
        map((response) => {
          return response.body;
        }),
        catchError((error) => throwError(() => error.error))
      );
  }
}
