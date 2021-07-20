import { CookiesManagmentService } from './cookies-managment.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  URL_SERVER: string

  constructor(
    private http: HttpClient,
    private cookieMgntService: CookiesManagmentService
  ) {
    this.URL_SERVER = environment.SERVER_URL;
  }

  GetCategories(): Observable<any> {
    const ruta = `${this.URL_SERVER}/categories`
    return this.http.get(ruta);
  }

  GetCategory(idCategory: number): Observable<any> {
    const ruta = `${this.URL_SERVER}/categories/${idCategory}`;
    return this.http.get(ruta);
  }

  PostCategory(title: string): Observable<any> {
    const token = this.cookieMgntService.getToken();
    const ruta = `${this.URL_SERVER}/categories`;
    const body = { title: title };
    const headers = { headers: { authorization: `Bearer ${token}` } };

    return this.http.post(ruta, body, headers);
  }

  PutCategory(id: number, title: string): Observable<any> {
    const token = this.cookieMgntService.getToken();
    const ruta = `${this.URL_SERVER}/categories/${id}`;
    const body = { title: title };
    const headers = { headers: { authorization: `Bearer ${token}` } };

    return this.http.put(ruta, body, headers);
  }

  DeleteCategory(id: number): Observable<any> {
    const token = this.cookieMgntService.getToken();
    const ruta = `${this.URL_SERVER}/categories/${id}`;
    const headers = { headers: { authorization: `Bearer ${token}` } };

    return this.http.delete(ruta, headers);
  }

  DetailCategory(id: number): Observable<any> {
    const token = this.cookieMgntService.getToken();
    const ruta = `${this.URL_SERVER}/categories/details/${id}`;
    const headers = { headers: { authorization: `Bearer ${token}` } };

    return this.http.get(ruta, headers);
  }
}
