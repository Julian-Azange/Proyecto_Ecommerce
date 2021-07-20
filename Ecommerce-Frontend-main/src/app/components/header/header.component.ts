import { CategoryService } from './../../services/category.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {CartModelServer} from '../../models/cart.model';
import {CartService} from '../../services/cart.service';
import {UserService} from '../../services/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartData: CartModelServer;
  cartTotal: number;
  authState: boolean;
  categories: any[];
  searcherForm: FormGroup;

  constructor(
    public cartService: CartService,
    public userService: UserService,
    private router: Router,
    private categoryService: CategoryService,
    private fBuilder: FormBuilder
  ) {

    this.categories = [];
    this.searcherForm = this.fBuilder.group({
      searcher: ['', [Validators.required, Validators.maxLength(150)]]
    });
  }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
    this.cartService.cartData$.subscribe(data => this.cartData = data);

    this.VerificarAlCambioDePagina();
    this.GetCategories();
  }

  GetCategories(): void {
    this.categoryService.GetCategories().subscribe({
      next: (resp) => {
        this.categories = resp.data;
      },
      error: (error) => {
        alert('No se pudo cargar las categorias');
      }
    })
  }


  VerificarAlCambioDePagina(): void{
    environment.auth.subscribe(variable => {
      this.authState = variable;
    });
  }

  RedirectToSearch(): void{
    if (this.searcher.valid) {
      this.router.navigate([`/results/search/0/${this.searcher.value}`]);
    }
  }

  get searcher(): any {
    return this.searcherForm.controls.searcher
  }

}
