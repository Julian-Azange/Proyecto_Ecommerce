import { Observable } from 'rxjs';
import { CookiesManagmentService } from './cookies-managment.service';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: 'root'
})

export class OrderService {

    private products: ProductResponseModel[] = [];
    private serverUrl = environment.SERVER_URL;

    constructor(
      private http: HttpClient,
      private cookieMgntService: CookiesManagmentService
    ){

    }

    getSingleOrder(orderId: number){
        return this.http.get<ProductResponseModel[]>(this.serverUrl + '/orders/' + orderId).toPromise();
    }


    getCompleteDetails(): Observable<any> {
      const token = this.cookieMgntService.getToken() || null;

      if (!token) {
        alert('Debe loguearse antes de realizar esta acción');
        throw new Error();
      }

      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const url = `${this.serverUrl}/orders/all_orders`;

      return this.http.get(url, headers);
    }

    getCompleteDetailsByAdmin(id: number): Observable<any> {
      const token = this.cookieMgntService.getToken() || null;

      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const url = `${this.serverUrl}/orders/get_order/${id}`;

      return this.http.get(url, headers);
    }


}

interface ProductResponseModel {
    id: number;
    title: string;
    description: string;
    price: number;
    quantityOrdered: number;
    image: string;
}
