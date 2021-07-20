import { ProductService } from '@app/services/product.service';
import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-producto-admin',
  templateUrl: './producto-admin.component.html',
  styleUrls: ['./producto-admin.component.scss']
})
export class ProductoAdminComponent implements OnInit {
  productos: any[];
  productoToDelete: any;

  constructor(
    private productService : ProductService
  ) {
    this.productoToDelete = {
      id: -1,
      title: ''
    }
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.GetProducts().pipe(take(1)).subscribe({
      next: (resp) => {
        this.productos = resp.data.sort((a, b) => b.id - a.id );
      }
    });
  }

  DeleteProduct(id: number): void {
    this.productService.DeleteProduct(id).subscribe({
      next: () => {
        this.getProducts();
      },
      error: () => {
        alert('No se eliminó')
      }
    })
  }

  FillProductToDelete(id: number): void {
    const choosen = this.productos.find(ele => ele.id === id);
    this.productoToDelete = choosen;
  }
}
