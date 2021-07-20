import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '@app/services/order.service';

@Component({
  selector: 'app-usuarios-details',
  templateUrl: './usuarios-details.component.html',
  styleUrls: ['./usuarios-details.component.scss']
})
export class UsuariosDetailsComponent implements OnInit {
  detalles: any[];
  ordenes: any[];
  modalProducto: any[];
  idUser: number;

  constructor(
    private orderService: OrderService,
    private avRoute: ActivatedRoute
  ) {
    this.detalles = [];
    this.idUser = this.avRoute.snapshot.params.idUser || -1;
  }

  ngOnInit(): void {
    this.GetDetalles();
  }

  GetDetalles(): void{
    this.orderService.getCompleteDetailsByAdmin(this.idUser).subscribe(
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
