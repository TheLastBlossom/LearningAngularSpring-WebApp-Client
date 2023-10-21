import { Client } from "../../client/client";
import { BillItem } from "./bill-item";

export class Bill {
    id!: number;
    description?:string;
    observation?:string;
    createdAt!:string;
    client!: Client;
    billItems: Array<BillItem> = [];
    total!: number;
}
