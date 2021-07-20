import { CategoryService } from './../../services/category.service';
import { Product } from './../../models/product.model';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-producto-add-edit',
  templateUrl: './producto-add-edit.component.html',
  styleUrls: ['./producto-add-edit.component.scss']
})
export class ProductoAddEditComponent implements OnInit {
  idProduct: number;
  categoriesForForm: any;
  productForm: FormGroup;
  productToEdit: Product;
  productToSend: Product;
  titleText: string;
  btn_text: string;

  constructor(
    private fBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private avRoute: ActivatedRoute,
    private router: Router
  ) {
    this.titleText = 'Agregar nuevo producto';
    this.btn_text = 'Guardar';
    this.productToEdit = null;
    this.idProduct = this.avRoute.snapshot.params.idProduct;
    this.productForm = this.fBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      cat_id: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      price: [0, [Validators.required, Validators.min(0)]],
      image: ['', [Validators.required]],
      images: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      short_desc: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.GetCategoriesForForm();
    if (this.idProduct && Number.isInteger(Number(this.idProduct))) {
      this.GetProductoToChange();
      this.ChangeNameBtn();
    }
  }

  GetCategoriesForForm(): void {
    this.categoryService.GetCategories().subscribe({
      next: (value) => { this.categoriesForForm = value.data; },
      error: () => { alert('No se pudo cargar las categorias, reinicie la página por favor') }
    })
  }

  GetProductoToChange(): void {
    this.productService.GetProductAdmin(this.idProduct).subscribe({
      next: (value) => {
        this.productToEdit = value.data[0];
        this.productForm.patchValue({
          title: value.data[0].title,
          cat_id: Number(value.data[0].cat_id),
          description: value.data[0].description,
          price: Number(value.data[0].price),
          image: value.data[0].image,
          images: value.data[0].images,
          quantity: Number(value.data[0].quantity),
          short_desc: value.data[0].short_desc
        });
      },
      error: () => {
        alert('No se pudo cargar el producto');
      }
    });
  }

  PostProductToSend(): void {
    this.productService.PostProduct(this.productToSend).subscribe({
      next: () => {
        this.router.navigate(['/admin/producto'])
      },
      error: () => {
        alert('No se pudo guardar');
      }
    });
  }

  PutProductToSend(): void {
    this.productService.PutProduct(this.idProduct, this.productToSend).subscribe({
      next: () => {
        this.router.navigate(['/admin/producto'])
      },
      error: () => {
        alert('No se pudo editar');
      }
    });
  }

  ChangeNameBtn(): void {
    this.titleText = 'Editar Producto';
    this.btn_text = 'Editar';
  }

  PrepareProductToSend(): void {
    this.productToSend = {
      title: this.productForm.controls.title.value,
      cat_id: this.productForm.controls.cat_id.value,
      description: this.productForm.controls.description.value,
      price: this.productForm.controls.price.value,
      image: this.productForm.controls.image.value,
      quantity: this.productForm.controls.quantity.value,
      images: this.productForm.controls.images.value,
      short_desc: this.productForm.controls.short_desc.value
    }
  }

  Submit(): void {
    this.PrepareProductToSend();
    if (this.idProduct) {
      this.PutProductToSend();
    } else {
      this.PostProductToSend();
    }
  }

  get title(): any {
    return this.productForm.controls.title;
  }

  get cat_id(): any {
    return this.productForm.controls.cat_id;
  }

  get description(): any {
    return this.productForm.controls.description;
  }

  get price(): any {
    return this.productForm.controls.price;
  }

  get image(): any {
    return this.productForm.controls.image;
  }

  get quantity(): any {
    return this.productForm.controls.quantity;
  }

  get images(): any {
    return this.productForm.controls.images;
  }

  get short_desc(): any {
    return this.productForm.controls.short_desc;
  }

}
