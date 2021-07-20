import { CookiesManagmentService } from './cookies-managment.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ProductModelServer, ServerResponse, Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = environment.SERVER_URL;
  constructor(
    private http: HttpClient,
    private cookieMgntService: CookiesManagmentService
  ) { }

  /* Recuperar todos los productos del servidor backend. */
  getAllProducts(numberOfResults = 15): Observable<ServerResponse> {
    return this.http.get<ServerResponse>(this.SERVER_URL + '/products', {
      params: {
        limit: numberOfResults.toString()
      }
    });
  }

  /* OBTENER UN SOLO PRODUCTO DEL SERVIDOR*/
  getSingleProduct(id: number): Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(this.SERVER_URL + '/products/' + id);
  }

  /*OBTENER PRODUCTOS DE UNA CATEGORÍA */
  getProductsFromCategory(catName: string): Observable<ProductModelServer[]> {
    return this.http.get<ProductModelServer[]>(this.SERVER_URL + '/products/category/' + catName);
  }

  /* BUSQUEDAS DE PRODUCTO EN GRUPOS DE 7*/
  getProductsByText(text: string, page: number): Observable<any> {
    const url = `${this.SERVER_URL}/products/search/${page}/${text}`;

    return this.http.get<ProductModelServer[]>(url);
  }

  /* BUSQUEDAS DE PRODUCTO EN GRUPOS DE 7*/
  getProductsByCategory(idCategory: number, page: number): Observable<any> {
    const url = `${this.SERVER_URL}/products/category/${page}/${idCategory}`;

    return this.http.get<ProductModelServer[]>(url);
  }



  /*SOLO ADMIN*/
  GetProducts(): Observable<any> {
    const token = this.cookieMgntService.getToken();
    const headers = { headers: { authorization: `Bearer ${token}` } };
    const ruta = `${this.SERVER_URL}/products/admin/getAll`
    return this.http.get(ruta, headers);
  }

  GetProductAdmin(idProduct: number): Observable<any> {
    const token = this.cookieMgntService.getToken();
    const headers = { headers: { authorization: `Bearer ${token}` } };
    const ruta = `${this.SERVER_URL}/products/admin/${idProduct}`;
    return this.http.get(ruta, headers);
  }

  PostProduct(prod: Product): Observable<any> {
    const token = this.cookieMgntService.getToken();
    const ruta = `${this.SERVER_URL}/products`;
    const headers = { headers: { authorization: `Bearer ${token}` } };
    const body = {
      title: prod.title,
      image: prod.image,
      images: prod.images,
      description: prod.description,
      price: prod.price,
      quantity: prod.quantity,
      short_desc: prod.short_desc,
      cat_id: prod.cat_id
    };

    return this.http.post(ruta, body, headers);
  }

  PutProduct(id: number, prod: Product): Observable<any> {
    const token = this.cookieMgntService.getToken();
    const ruta = `${this.SERVER_URL}/products/${id}`;
    const body = {
      title: prod.title,
      image: prod.image,
      images: prod.images,
      description: prod.description,
      price: prod.price,
      quantity: prod.quantity,
      short_desc: prod.short_desc,
      cat_id: prod.cat_id
    };
    const headers = { headers: { authorization: `Bearer ${token}` } };

    return this.http.put(ruta, body, headers);
  }

  DeleteProduct(id: number): Observable<any> {
    const token = this.cookieMgntService.getToken();
    const ruta = `${this.SERVER_URL}/products/${id}`;
    const headers = { headers: { authorization: `Bearer ${token}` } };

    return this.http.delete(ruta, headers);
  }

  DetailCategory(id: number): Observable<any> {
    const token = this.cookieMgntService.getToken();
    const ruta = `${this.SERVER_URL}/products/details/${id}`;
    const headers = { headers: { authorization: `Bearer ${token}` } };

    return this.http.get(ruta, headers);
  }
}
