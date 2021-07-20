import { UserModel } from '@app/models/user.model';
import { Router } from '@angular/router';
import { CookiesManagmentService } from './cookies-managment.service';
import { Injectable } from '@angular/core';
import { AuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  auth = false;
  private SERVER_URL = environment.SERVER_URL;
  private user;
  authState$ = new BehaviorSubject<boolean>(this.auth);
  userData$ = new BehaviorSubject<SocialUser | ResponseModel | object>(null);
  loginMessage$ = new BehaviorSubject<string>(null);
  userRole: number;

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private cookieMgntService: CookiesManagmentService,
    private router: Router
  ) {

    authService.authState.subscribe((user: SocialUser) => {
      if (user != null) {
        this.httpClient.get(`${this.SERVER_URL}/users/validate/${user.email}`).subscribe((res: { status: boolean, user: object }) => {
          //  No user exists in database with Social Login
          if (!res.status) {
            // Send data to backend to register the user in database so that the user can place orders against his user id
            this.registerUser({
              email: user.email,
              fname: user.firstName,
              lname: user.lastName,
              password: '123456'
            }, user.photoUrl, 'social').subscribe(response => {
              if (response.message === 'Registration successful') {
                this.auth = true;
                this.userRole = 555;
                this.authState$.next(this.auth);
                this.userData$.next(user);
              }
            });

          } else {
            this.auth = true;
            // @ts-ignore
            this.userRole = res.user.role;
            this.authState$.next(this.auth);
            this.userData$.next(res.user);
          }
        });

      }
    });
  }

  //  Login User with Email and Password
  loginUser(email: string, password: string) {

    this.httpClient.post<ResponseModel>(`${this.SERVER_URL}/auth/login`, { email, password })
      .pipe(catchError((err: HttpErrorResponse) => of(err.error.message)))
      .subscribe((data: ResponseModel) => {
        if (typeof (data) === 'string') {
          this.loginMessage$.next(data);
        } else {
          this.auth = data.auth;
          this.userRole = data.role;
          this.authState$.next(this.auth);
          this.userData$.next(data);
        }
      });

  }


  // ALTERNATIVA
  LoginUsers(email: string, password: string): Observable<ResponseModel> {
    const url = `${this.SERVER_URL}/auth/login`;
    const body = { email, password };

    return this.httpClient.post<ResponseModel>(url, body);
  }

  LogoutUser(): void {
    this.cookieMgntService.deleteCookies();
    environment.auth.next(false);
  }


  //  Google Authentication
  googleLogin() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  logout() {
    this.authService.signOut();
    this.auth = false;
    this.authState$.next(this.auth);
  }

  registerUser(formData: any, photoUrl?: string, typeOfUser?: string): Observable<{ message: string }> {
    const { fname, lname, email, password } = formData;
    console.log(formData);
    return this.httpClient.post<{ message: string }>(`${this.SERVER_URL}/auth/register`, {
      email,
      lname,
      fname,
      typeOfUser,
      password,
      photoUrl: photoUrl || null
    });
  }


  // NEWS
  getUserByToken(): any{

  }

  getMyUser(): Observable<any>{
    const token = this.cookieMgntService.getToken() || null;

    if (!token) {
      return of(null);
    } else{
      const url = `${this.SERVER_URL}/users/myUser/user`;
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      return this.httpClient.get(url, headers);
    }
  }


  /*ADMIN UTILS*/
  GetAdminUsers(): Observable<any> {
    const token = this.cookieMgntService.getToken();
    const ruta = `${this.SERVER_URL}/users/admin/get_all`;
    const headers = { headers: { authorization: `Bearer ${token}` } };
    return this.httpClient.get(ruta, headers);
  }

  GetAdminUser(id: number): Observable<any> {
    const token = this.cookieMgntService.getToken();
    const ruta = `${this.SERVER_URL}/users/admin/get/${id}`;
    const headers = { headers: { authorization: `Bearer ${token}` } };
    return this.httpClient.get(ruta, headers);
  }

  PostAdminUser(user: UserModel): Observable<any> {
    const token = this.cookieMgntService.getToken();
    const ruta = `${this.SERVER_URL}/users/admin/post`;
    const body = {
      username: user.username,
      password: user.password,
      email: user.email,
      fname: user.fname,
      lname: user.lname,
      age: user.age,
      role: user.role,
      photoUrl: user.photoUrl,
      type: user.type
    };
    const headers = { headers: { authorization: `Bearer ${token}` } };

    return this.httpClient.post(ruta, body, headers);
  }

  PutAdminUser(id: number, user: UserModel): Observable<any> {
    const token = this.cookieMgntService.getToken();
    const ruta = `${this.SERVER_URL}/users/admin/put/${id}`;
    const body = {
      username: user.username,
      password: user.password,
      email: user.email,
      fname: user.fname,
      lname: user.lname,
      age: user.age,
      role: user.role,
      photoUrl: user.photoUrl,
      type: user.type
    };
    const headers = { headers: { authorization: `Bearer ${token}` } };

    return this.httpClient.put(ruta, body, headers);
  }

  DeleteAdminUser(id: number): Observable<any> {
    const token = this.cookieMgntService.getToken();
    const ruta = `${this.SERVER_URL}/users/admin/delete/${id}`;
    const headers = { headers: { authorization: `Bearer ${token}` } };

    return this.httpClient.delete(ruta, headers);
  }

}


export interface ResponseModel {
  refresh: string;
  token: string;
  auth: boolean;
  email: string;
  username: string;
  fname: string;
  lname: string;
  photoUrl: string;
  userId: number;
  type: string;
  role: number;
}
