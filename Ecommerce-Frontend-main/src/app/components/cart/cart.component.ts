import {Component, OnInit, Inject} from '@angular/core';
import {CartModelServer} from '../../models/cart.model';
import {CartService} from '../../services/cart.service';
import { UserService } from './../../services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartData: CartModelServer;
  cartTotal: number;
  subTotal: number;

  products: any[];


  constructor(public cartService: CartService) {
    this.products = [];
  }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data: CartModelServer) => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }


  ChangeQuantity(index: number, increase: boolean) {
    this.cartService.UpdateCartItems(index, increase);
  }

  consola(): void{
    console.log(this.cartData);
    console.log(this.cartTotal);
    console.log(this.subTotal);
  }
}
