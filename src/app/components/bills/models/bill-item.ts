import { Product } from "./product";

export class BillItem {
    id!:number;
    quantity:number = 1;
    product!:Product;
    amount!:number;
}
