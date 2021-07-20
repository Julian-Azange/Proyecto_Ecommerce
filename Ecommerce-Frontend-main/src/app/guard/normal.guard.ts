import { environment } from './../../environments/environment';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class NormalGuard implements CanActivate {
  constructor(private userService: UserService,
              private router: Router) {
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userService.userRole === 555 || this.userService.userRole === 777) {
      return true;
    } else {
      if (environment.auth) {
        this.router.navigate(['/home']).then();
      } else {
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}}).then();
      }
      return false;
    }

  }

}
