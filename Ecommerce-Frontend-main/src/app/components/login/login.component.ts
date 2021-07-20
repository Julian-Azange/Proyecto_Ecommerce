import { environment } from './../../../environments/environment';
import { CookiesManagmentService } from './../../services/cookies-managment.service';
import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from 'angularx-social-login';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import { EmailValidator } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { CheckEmailService } from '@app/validators/check-email.service';
import { Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [EmailValidator]
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  loginMessage: string;
  userRole: number;

  /* registro */
  registrationForm: FormGroup;
  // tslint:disable-next-line:max-line-length
  private emailPattern = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])';
  comparePassword: boolean;
  registrationMessage: string;

  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private checkEmailService: CheckEmailService,
              private cookieMgntService: CookiesManagmentService) {


                this.registrationForm = fb.group({
                  fname: ['', [Validators.required, Validators.minLength(4)]],
                  lname: ['', [Validators.required, Validators.minLength(4)]],
                  email: ['', [Validators.required, Validators.pattern(this.emailPattern)],
                    [this.checkEmailService.emailValidate()]
                  ],
                  password: ['', [Validators.required, Validators.minLength(6)]],
                  confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
                });
  }
  /* registro */
  get formControls() {
    return this.registrationForm.controls;
  }

  ngOnInit(): void {
    this.userService.authState$.subscribe(authState => {
      if (authState) {
        this.router.navigateByUrl(this.route.snapshot.queryParams.returnUrl || '/profile');

      } else {
        this.router.navigateByUrl('/login');
      }
    });

    this.registrationForm.valueChanges
      .pipe(map((controls) => {
        return this.formControls.confirmPassword.value === this.formControls.password.value;
      }))
      .subscribe(passwordState => {
        this.comparePassword = passwordState;
      });

  }


  signInWithGoogle() {
    this.userService.googleLogin();
  }

  login(form: NgForm) {
    const email = this.email;
    const password = this.password;

    if (form.invalid) {
      return;
    }

    form.reset();
    this.userService.loginUser(email, password);

    this.userService.loginMessage$.subscribe(msg => {
      this.loginMessage = msg;
      setTimeout(() => {
        this.loginMessage = '';
      }, 2000);
    });
  }


  LoginwithToken(form: NgForm) {
    const email = this.email;
    const password = this.password;

    if (form.invalid) {
      return;
    }

    form.reset();
    this.userService.LoginUsers(email, password).subscribe(
      resp => {
        environment.usuario.email = resp.email;
        environment.usuario.fname = resp.fname;
        environment.usuario.lname = resp.lname;
        environment.usuario.photoUrl = resp.photoUrl;
        environment.usuario.userId = resp.userId;
        environment.usuario.username = resp.username;
        environment.auth.next(true);

        this.cookieMgntService.setToken(resp.token);
        this.cookieMgntService.setRol(resp.role);
        this.cookieMgntService.setType(resp.type);
        this.cookieMgntService.setRefresh(resp.refresh);

        this.router.navigate(['/profile']);
      },
      error => {
        alert('Inténtelo otra vez');
      }
    )
  }

  registerUser() {
    if (this.registrationForm.invalid) {
      return;
    }
    // @ts-ignore
    this.userService.registerUser({...this.registrationForm.value}).subscribe((response: { message: string }) => {
      this.registrationMessage = response.message;
    });

    this.registrationForm.reset();
  }
}
