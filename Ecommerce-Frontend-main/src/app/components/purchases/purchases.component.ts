import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {
  detalles: any[];
  ordenes: any[];
  modalProducto: any[];

  constructor(
    private orderService: OrderService
  ) {
    this.detalles = [];
  }

  ngOnInit(): void {
    this.GetDetalles();
  }

  GetDetalles(): void{
    this.orderService.getCompleteDetails().subscribe(
      resp => {
        let id_carts: any[] = resp.user_orders.map(ele => { return ele.idOrder; });
        id_carts = id_carts.filter((elem: any, index: any, self: string | any[]) => { return index === self.indexOf(elem); });

        const response: any[] = resp.user_orders;
        id_carts.forEach((id_ord, index) => {
          this.detalles[index] = response.filter(elefilter => elefilter.idOrder === id_ord);
        });
        console.log(this.detalles);
        this.detalles.sort((a, b) => b[0].idOrder - a[0].idOrder)
      },
      error => {
        alert('No se pudieron cargar las compras');
      }
    )
  }

  LlenarModal(index: number): void{
    this.modalProducto = this.detalles[index];
  }
}
