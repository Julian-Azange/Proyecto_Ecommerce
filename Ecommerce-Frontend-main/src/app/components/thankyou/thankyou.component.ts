import { CartService } from '@app/services/cart.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'mg-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss']
})

export class ThankyouComponent implements OnInit {
  idOrder: number;
  products: any[];
  cartTotal: number;

  constructor(
    private router: Router,
    private avRoute: ActivatedRoute,
    private cartService: CartService
  ) {
    this.products = [];
    this.idOrder = this.avRoute.snapshot.params.idOrder || -1;
    this.cartTotal = 0;
    this.GetPurchase();
  }

  ngOnInit(): void {
  }

  GetPurchase(): void {
    this.cartService.GetMyCart(this.idOrder).subscribe({
      next: (value) => {
        console.log(value)
        this.products = value.data;
        this.GetCartTotal();
      },
      error: () => {
        alert('Ocurrio un error');
      }
    });
  }

  GetCartTotal(): void {
    this.products.forEach(prod => {
      this.cartTotal = this.cartTotal + (prod.price * prod.quantity);
    });
  }

}

interface ProductResponseModel {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}
