
import { Bill } from "../bills/models/bill";
import { Region } from "./region";

export class Client{
    id!: number;
    name!:string;
    surname!: string;
    createAt!: string;
    email!: string;
    photo?: string;
    region?: Region
    bills: Array<Bill> = []
}