import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import IUserState from './IUserState.interface';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  router = inject(Router);
  public _userState: BehaviorSubject<IUserState> = new BehaviorSubject({
    jwt: '',
    _id: '',
    email: '',
    fullname: '',
  });

  getUserState$ = this._userState.asObservable();
  isAuth$ = this.getUserState$.pipe(
    map((userState) => (userState.jwt ? true : false))
  );

  setUserState(userState: IUserState) {
    this._userState.next(userState);
  }
  constructor(private http: HttpClient) {}
  login(user: { email: string; password: string }) {
    return this.http.post<{ success: boolean; results: string }>(
      environment.SERVER + '/api/users/login',
      user
    );
  }
  signup(fullname: string, email: string, password: string) {
    return this.http.post<{ success: boolean; results: string }>(
      environment.SERVER + '/api/users/signup',
      { fullname, email, password }
    );
  }
  logout() {
    this.setUserState({
      jwt: '',
      _id: '',
      email: '',
      fullname: '',
    });
    localStorage.removeItem('USER_STATE');
    this.router.navigate(['/login']);
  }
}
