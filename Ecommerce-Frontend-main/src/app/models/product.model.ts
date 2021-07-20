export interface ProductModelServer {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  images: string;
}

export interface ServerResponse {
  count: number;
  products: ProductModelServer[];
}

export class Product {
  id?: number;
  title: string;
  cat_id: number;
  description: string;
  price: number;
  image: string;
  quantity: number;
  images: string;
  short_desc: string;

  constructor(){
    this.title = '';
    this.cat_id = -1;
    this.description = '';
    this.price = 0;
    this.image = '';
    this.quantity = 0;
    this.images = '';
    this.short_desc = '';
  }
}
