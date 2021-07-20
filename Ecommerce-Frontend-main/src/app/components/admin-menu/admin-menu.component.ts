import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookiesManagmentService } from '@app/services/cookies-managment.service';
import { UserService } from '@app/services/user.service';
import { AuthService } from 'angularx-social-login';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {

  myUser: any;


  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private cookieMgntService: CookiesManagmentService) {
  }

  ngOnInit(): void {
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
