import {Customer} from "./model.customer";
import {CtrctCustomerProduct} from "./model.contratClientProduit";
import {CtrctSupplier} from "./model.contratFournisseur";

export class CtrctCustomer {

  id:any;
  dteStrt:Date;
  dteEnd:Date;
  ctrtName:string;
  customer:Customer;
  pilote:string;

  ctrctCustomerProducts:Array<CtrctCustomerProduct>=new Array();

  contrats:Array<CtrctSupplier> = new Array();

  constructor() {

  }

}
