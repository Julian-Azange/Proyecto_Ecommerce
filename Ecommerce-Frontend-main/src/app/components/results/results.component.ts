import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductModelServer, ServerResponse } from '@app/models/product.model';
import { CartService } from '@app/services/cart.service';
import { ProductService } from '@app/services/product.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  products: ProductModelServer[] = [];
  text: string;
  page: number;
  idCategory: number;
  nullMessage: string;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private avRoute: ActivatedRoute
  ) {
    this.text = this.avRoute.snapshot.params.text || null;
    this.page = this.avRoute.snapshot.params.page || 0;
    this.idCategory = this.avRoute.snapshot.params.idCategory || null;
    this.nullMessage = '';
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false
    };
  }

  ngOnInit(): void {
    if (this.text) {
      this.GetProductsByText();
    } else {
      this.GetProductsByCategory();
    }
  }

  GetProductsByText(): void {
    this.productService.getProductsByText(this.text, this.page).subscribe((prods: any) => {
      this.products = prods.data;
      if (this.products.length === 0) {
        this.nullMessage = 'No existe productos con este criterio';
      }
    });
  }

  GetProductsByCategory(): void {
    this.productService.getProductsByCategory(this.idCategory, this.page).subscribe((prods: any) => {
      this.products = prods.data;
      if (this.products.length === 0) {
        this.nullMessage = 'No existe productos con este criterio';
      }
    });
  }

  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  AddToCart(id: number) {
    this.cartService.AddProductToCart(id);
  }

}
