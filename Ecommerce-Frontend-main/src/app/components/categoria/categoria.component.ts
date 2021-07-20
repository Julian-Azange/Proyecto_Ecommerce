import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent implements OnInit {
  categorias: any[];
  categoryToDelete: any;

  constructor(
    private categoryService : CategoryService
  ) {
    this.categoryToDelete = {
      id: -1,
      title: ''
    }
  }


  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.GetCategories().pipe(take(1)).subscribe({
      next: (resp) => {
        this.categorias = resp.data;
        console.log(this.categorias);
      }
    });
  }

  DeleteCategory(id: number): void {
    this.categoryService.DeleteCategory(id).subscribe({
      next: () => {
        this.getCategories();
      },
      error: () => {
        alert('No se eliminó')
      }
    })
  }

  FillCategoryToDelete(id: number): void {
    const choosen = this.categorias.find(ele => ele.id === id);
    this.categoryToDelete = choosen;
  }
}
