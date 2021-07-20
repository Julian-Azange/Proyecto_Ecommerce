import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CartService } from '@app/services/cart.service';
import { OrderService } from '@app/services/order.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartModelServer } from '@app/models/cart.model';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  cartTotal: number;
  cartData: CartModelServer;
  userId;
  model: any = {};
  formulario: FormGroup;

  constructor(private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
    this.userService.userData$.subscribe(data => {
      // @ts-ignore
      this.userId = data.userId || data.id;
    });

  }

  onCheckout() {
    if (this.cartTotal > 0) {
      const carrito: any[] = this.cartData.data.map(ele => { return { product_id: ele.product.id, quantity: ele.numInCart } });
      console.log(carrito);
      this.spinner.show();
      this.cartService.checkOutCart(carrito).subscribe(
        resp => {
          this.spinner.hide();
          localStorage.removeItem('cart');

          this.cartService.cartTotal$.next(0);
          this.cartService.cartData$.next({ total: 0, data: [{ numInCart: 0, product: undefined }] });
          this.cartService.cartDataServer = {
            total: 0,
            data: [{
              numInCart: 0,
              product: undefined
            }]
          };
          this.cartService.cartDataClient = {
            total: 0,
            prodData: [{
              incart: 0,
              id: 0
            }]
          };
          const idOrder = resp.data.id;
          this.router.navigate(['/thankyou/', idOrder]);
        },
        error => {
          this.spinner.hide()
          alert('No se pudo guardar');
        }
      )
      // .then(p => {
      // this.cartService.CheckoutFromCart(this.userId);
      // });
    } else {
      return;
    }
  }

  formSubmit() {
    console.log(this.model);
  }
}
function next(arg0: number): import("rxjs").BehaviorSubject<number> {
  throw new Error('Function not implemented.');
}

