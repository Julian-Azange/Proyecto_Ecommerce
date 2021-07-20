import { ProductService } from '@app/services/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-producto-details',
  templateUrl: './producto-details.component.html',
  styleUrls: ['./producto-details.component.scss']
})
export class ProductoDetailsComponent implements OnInit {
  idProduct: number;
  products: any[];

  sold_quantity: number;
  total_income: number;

  constructor(
    private productService: ProductService,
    private router: Router,
    private avRoute: ActivatedRoute
  ) {
    this.idProduct = this.avRoute.snapshot.params.idProduct || -1;
    this.products = [];
    this.sold_quantity = 0;
    this.total_income = 0;
  }

  ngOnInit(): void {
    this.GetDetails();
  }

  GetDetails(): void{
    this.productService.DetailCategory(this.idProduct).subscribe({
      next: (value) => {
        this.products = value.data;
        this.products.forEach(prod => {
          this.sold_quantity = this.sold_quantity + (prod.sum_prods || 0);
          this.total_income = this.total_income + (prod.price * prod.sum_prods);
        });
      }
    });
  }
}
