import { Component, OnInit } from '@angular/core';
import { UserModel } from '@app/models/user.model';
import { UserService } from '@app/services/user.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.component.html',
  styleUrls: ['./usuarios-admin.component.scss']
})
export class UsuariosAdminComponent implements OnInit {
  users: any[];
  userToDelete: UserModel;

  constructor(
    private userService : UserService
  ) {
    this.userToDelete = new UserModel;
  }


  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.GetAdminUsers().pipe(take(1)).subscribe({
      next: (resp) => {
        this.users = resp.data;
        console.log(this.users);
      }
    });
  }

  DeleteUser(id: number): void {
    this.userService.DeleteAdminUser(id).subscribe({
      next: () => {
        this.getUsers();
      },
      error: () => {
        alert('No se eliminó')
      }
    })
  }

  FillUserToDelete(id: number): void {
    const choosen = this.users.find(ele => ele.id === id);
    this.userToDelete = choosen;
  }
}
