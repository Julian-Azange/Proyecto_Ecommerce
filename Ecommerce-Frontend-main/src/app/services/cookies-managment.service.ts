import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookiesManagmentService {
  private duration: number;
  private path: string;
  private domain: string;
  private secure: boolean;

  constructor(private cookieService: CookieService) {
    this.duration = 1;
    this.path = '/';
    this.domain = 'localhost';
    this.secure = false;
  }

  setType(type: string): void {
    this.cookieService.set('type', type, this.duration, this.path, this.domain, this.secure, 'Strict');
  }

  setToken(token: string): void {
    this.cookieService.set('token', token, this.duration, this.path, this.domain, this.secure, 'Strict');
  }

  setRol(rol: number): void {
    this.cookieService.set('rol', String(rol), this.duration, this.path, this.domain, this.secure, 'Strict');
  }

  setRefresh(refreshToken: string): void {
    this.cookieService.set('refresh', String(refreshToken), this.duration, this.path, this.domain, this.secure, 'Strict');
  }

  checkTypTokRolRef(): boolean {
    if (
      this.cookieService.check('type') &&
      this.cookieService.check('token') &&
      this.cookieService.check('rol') &&
      this.cookieService.check('refresh')
    ) {
      return true;
    }
    return false;
  }

  getToken(): string {
    return String(this.cookieService.get('token'));
  }

  getRol(): number {
    return Number(this.cookieService.get('rol'));
  }

  getType(): string {
    return String(this.cookieService.get('type'));
  }

  getRefresh(): string {
    return String(this.cookieService.get('refresh'));
  }

  deleteCookies(): void {
    this.cookieService.deleteAll(this.path, this.domain, this.secure, 'Strict');
  }

}
