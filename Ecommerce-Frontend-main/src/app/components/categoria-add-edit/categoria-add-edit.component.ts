import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from './../../services/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { title } from 'process';

@Component({
  selector: 'app-categoria-add-edit',
  templateUrl: './categoria-add-edit.component.html',
  styleUrls: ['./categoria-add-edit.component.scss']
})
export class CategoriaAddEditComponent implements OnInit {
  idCategory: number;
  categoryForm: FormGroup;
  category: any;
  title: string;
  btn_text: string;

  constructor(
    private fBuilder: FormBuilder,
    private categoryService: CategoryService,
    private avRoute: ActivatedRoute,
    private router: Router
  ) {
    this.title = 'Agregar nueva categoría';
    this.btn_text = 'Guardar';
    this.category = null;
    this.idCategory = this.avRoute.snapshot.params.idCategory;
    this.categoryForm = this.fBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    if (this.idCategory && Number.isInteger(Number(this.idCategory))) {
      this.GetCategory();
      this.ChangeNameBtn();
    }
  }

  GetCategory(): void {
    this.categoryService.GetCategory(this.idCategory).subscribe({
      next: (value) => {
        this.category = value.data[0];
        this.categoryForm.patchValue({
          title: this.category.title
        });
      },
      error: () => {
        alert('No se pudo cargar la categoria');
      }
    });
  }

  PostCategory(): void {
    this.categoryService.PostCategory(this.titleCat.value).subscribe({
      next: () => {
        this.router.navigate(['/admin/categoria'])
      },
      error: () => {
        alert('No se pudo guardar');
      }
    });
  }

  PutCategory(): void {
    this.categoryService.PutCategory(this.idCategory, this.titleCat.value).subscribe({
      next: () => {
        this.router.navigate(['/admin/categoria'])
      },
      error: () => {
        alert('No se pudo editar');
      }
    });
  }

  ChangeNameBtn(): void {
    this.title = 'Editar Categoria';
    this.btn_text = 'Editar';
  }


  Submit(): void {
    if (this.idCategory) {
      this.PutCategory();
    } else {
      this.PostCategory();
    }
  }

  get titleCat(): any {
    return this.categoryForm.controls.title;
  }

  consola(): void{
    console.log(this.categoryForm);
  }

}
