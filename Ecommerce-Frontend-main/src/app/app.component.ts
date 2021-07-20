import { CookiesManagmentService } from './services/cookies-managment.service';
import { environment } from './../environments/environment';
import { UserService } from '@app/services/user.service';
import { TokenService } from './services/token.service';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/internal/operators/take';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  name = 'Accesorios M&M';
  refrescador: any;
  intervaloSegundos: number;

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private cookieMgntService: CookiesManagmentService
  ){
    this.intervaloSegundos = 1000 * 60 * 14; // 14 minutos
  }

  ngOnInit(): void {
    this.RecognizeUser();
    this.CicloRefresh();
  }



  RecognizeUser(): void {
    const verificadorCookies = this.cookieMgntService.checkTypTokRolRef();

    if (verificadorCookies) {
      this.userService.getMyUser().pipe(take(1)).subscribe(
        resp => {
          environment.auth.next(true);
          environment.usuario.lname = resp.lname;
          environment.usuario.fname = resp.fname;
          environment.usuario.email = resp.email;
          environment.usuario.username = resp.username;
          environment.usuario.photoUrl = resp.photoUrl;
          environment.usuario.userId = resp.userId;

          this.cookieMgntService.setType(resp.type);
          this.cookieMgntService.setRol(resp.role || 555);
          this.RefreshingToken();
        },
        error => {
          environment.auth.next(false);
          this.cookieMgntService.deleteCookies();
        }
      );
    }
  }


  CicloRefresh(): void{
    this.refrescador = interval(this.intervaloSegundos).subscribe(
      () => {
        this.RefreshingToken();
      },
      () => {
        console.log('error');
        environment.auth.next(false);
      }
    );
  }


  RefreshingToken(): void {
    if (environment.auth.value === true) {
      this.tokenService.refreshTokenNow().pipe(take(1)).subscribe(
        resp => {
          console.log('Token Refrescado');
          this.cookieMgntService.setToken(resp.token);
        },
        error => {
          this.cookieMgntService.deleteCookies();
          environment.auth.next(false);
        }
      );
    }

  }

}
