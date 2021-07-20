import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductModelServer, ServerResponse } from '@app/models/product.model';
import { CartService } from '@app/services/cart.service';
import { ProductService } from '@app/services/product.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  products: ProductModelServer[] = [];


  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((prods: ServerResponse) => {
      this.products = prods.products;
    });
  }

  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  getProductCategorie(cat_id: string){
    this.router.navigate(['/categories', cat_id]);
  }

  AddToCart(id: number) {
    this.cartService.AddProductToCart(id);
  }


  GetCategories(): void{
    this.categoryService.GetCategories().subscribe(
      resp => {
        console.log(resp)
      },
      error => {
        alert('No se pudo cargar las categorias');
      }
    )
  }

}
