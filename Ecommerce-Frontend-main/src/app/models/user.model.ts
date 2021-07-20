export class UserModel {
  id?: number;
  username: string;
  password: string;
  email: string;
  fname: string;
  lname: string;
  age: number;
  role: number;
  photoUrl: string;
  type: string;

  constructor(){
    this.username = '';
    this.password = '';
    this.email = '';
    this.fname = '';
    this.lname = '';
    this.age = 0;
    this.role = 555;
    this.photoUrl = '';
    this.type = '';
  }
}
