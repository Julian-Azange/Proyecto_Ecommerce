import { CookiesManagmentService } from './../services/cookies-managment.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router,
    private cookieMgntService: CookiesManagmentService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // TODO Cambios a Gmail
    // if (this.userService.auth) {
    //   return true;
    // }

    // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } }).then();
    // return false;

    const token = this.cookieMgntService.getToken();
    const rol = this.cookieMgntService.getRol();
    const type = this.cookieMgntService.getType();
    if (token && rol && type) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

}
