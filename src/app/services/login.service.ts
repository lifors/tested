import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = 'assets/users.json';

  constructor(private http: HttpClient) { }

  checkLogin(username: string): Observable<boolean> {
    return this.http.get<any>(this.loginUrl).pipe(
      map((response) => {
        return response.username === username;
      })
    );
  }
}
