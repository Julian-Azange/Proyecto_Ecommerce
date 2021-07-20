import { environment } from 'src/environments/environment';
import { CookiesManagmentService } from './../../services/cookies-managment.service';
import {Component, OnInit} from '@angular/core';
import {AuthService, SocialUser} from 'angularx-social-login';
import {ResponseModel, UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  myUser: any;


  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private cookieMgntService: CookiesManagmentService) {
  }

  ngOnInit(): void {
    // this.userService.userData$
    //   .pipe(
    //     map((user: SocialUser | ResponseModel) => {
    //       if (user instanceof SocialUser || user.type === 'social') {
    //         return {
    //           ...user,

    //         };
    //       } else {
    //         return user;
    //       }
    //     })
    //   )
    //   .subscribe((data: ResponseModel | SocialUser) => {
    //     this.myUser = data;
    //   });
    this.myUser = environment.usuario;
    this.myUser.role = Number(this.cookieMgntService.getRol());
    console.log(this.myUser.role);
  }

  logout() {
    // this.userService.logout();
    this.userService.LogoutUser();
    this.router.navigate(['/login']);
  }
}
