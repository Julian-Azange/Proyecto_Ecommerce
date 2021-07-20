import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categoria-details',
  templateUrl: './categoria-details.component.html',
  styleUrls: ['./categoria-details.component.scss']
})
export class CategoriaDetailsComponent implements OnInit {
  idCategory: number;
  products: any[];

  sold_quantity: number;
  total_income: number;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private avRoute: ActivatedRoute
  ) {
    this.idCategory = this.avRoute.snapshot.params.idCategory || -1;
    this.products = [];
    this.sold_quantity = 0;
    this.total_income = 0;
  }

  ngOnInit(): void {
    this.GetDetails();
  }

  GetDetails(): void{
    this.categoryService.DetailCategory(this.idCategory).subscribe({
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
