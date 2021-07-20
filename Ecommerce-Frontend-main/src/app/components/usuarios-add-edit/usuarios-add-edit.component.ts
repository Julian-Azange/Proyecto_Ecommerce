import { UserModel } from '@app/models/user.model';
import { UserService } from '@app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-usuarios-add-edit',
  templateUrl: './usuarios-add-edit.component.html',
  styleUrls: ['./usuarios-add-edit.component.scss']
})
export class UsuariosAddEditComponent implements OnInit {
  idUser: number;
  userForm: FormGroup;
  userToChange: UserModel;
  userToSend: UserModel;
  title: string;
  btn_text: string;

  constructor(
    private fBuilder: FormBuilder,
    private userService: UserService,
    private avRoute: ActivatedRoute,
    private router: Router
  ) {
    this.title = 'Agregar nueva producto';
    this.btn_text = 'Guardar';
    this.userToChange = new UserModel();
    this.userToSend = new UserModel();
    this.idUser = this.avRoute.snapshot.params.idUser;
    this.userForm = this.fBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.minLength(5)]],
      fname: ['', [Validators.required, Validators.minLength(5)]],
      lname: ['', [Validators.required, Validators.minLength(5)]],
      age: [0, [Validators.required, Validators.min(18)]],
      role: [555, [Validators.required]],
      photoUrl: ['']
    });
  }

  ngOnInit(): void {
    if (this.idUser && Number.isInteger(Number(this.idUser))) {
      this.GetUser();
      this.ChangeNameBtn();
    }
  }

  GetUser(): void {
    this.userService.GetAdminUser(this.idUser).subscribe({
      next: (value) => {
        this.userToChange = value.data;
        this.userForm.patchValue({
          username: value.data.username,
          password: 'Se debe cambiar la contraseña',
          email: value.data.email,
          fname: value.data.fname,
          lname: value.data.lname,
          age: value.data.age,
          role: value.data.role,
          photoUrl: value.data.photoUrl
        });
      },
      error: () => {
        alert('No se pudo cargar el usuario');
      }
    });
  }

  PostUser(): void {
    this.userService.PostAdminUser(this.userToSend).subscribe({
      next: () => {
        this.router.navigate(['/admin/users'])
      },
      error: () => {
        alert('No se pudo guardar');
      }
    });
  }

  PutUser(): void {
    this.userService.PutAdminUser(this.idUser, this.userToSend).subscribe({
      next: () => {
        this.router.navigate(['/admin/users'])
      },
      error: () => {
        alert('No se pudo editar');
      }
    });
  }

  ChangeNameBtn(): void {
    this.title = 'Editar Producto';
    this.btn_text = 'Editar';
  }


  Submit(): void {
    this.PrepareUserToSend();
    if (this.idUser) {
      this.PutUser();
    } else {
      this.PostUser();
    }
  }

  PrepareUserToSend(): void {
    this.userToSend = {
      username: this.username.value,
      password: this.password.value,
      email: this.email.value,
      fname: this.fname.value,
      lname: this.lname.value,
      age: this.age.value,
      role: this.role.value,
      photoUrl: this.photoUrl.value || 'https://image.shutterstock.com/image-vector/person-gray-photo-placeholder-man-260nw-1259815156.jpg',
      type: 'local'
    }
  }

  get username(): any {
    return this.userForm.controls.username;
  }

  get password(): any {
    return this.userForm.controls.password;
  }

  get email(): any {
    return this.userForm.controls.email;
  }

  get fname(): any {
    return this.userForm.controls.fname;
  }

  get lname(): any {
    return this.userForm.controls.lname;
  }

  get age(): any {
    return this.userForm.controls.age;
  }

  get role(): any {
    return this.userForm.controls.role;
  }

  get photoUrl(): any {
    return this.userForm.controls.photoUrl;
  }

}
