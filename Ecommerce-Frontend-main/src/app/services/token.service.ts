import { CookiesManagmentService } from './cookies-managment.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private httpClient: HttpClient,
    private cookieMgntService: CookiesManagmentService
  ) {  }

  refreshTokenNow(): Observable<any> {
    const refresh_token = this.cookieMgntService.getRefresh() || null;
    const url = environment.SERVER_URL + '/auth/refresh'
    const body = { refresh: refresh_token };

    return this.httpClient.post(url, body);
  }





}
