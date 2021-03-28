

import {CtrctSupplierProduct} from "./model.contratFournisseurProduit";
import {CtrctCustomer} from "./model.contratClient";
import {Customer} from "./model.customer";


export class CtrctSupplier {

  id:any;
  ctrtName:string;
  dteStrt:Date;
  dteEnd:Date;
  contact:string;
  price:number;
  marge:number;
  statut:string;
  commentaire:string;
  devise:string;
  fournisseur : Customer;

  ctrctCustomer:CtrctCustomer;

  ctrctSupplierProducts:Array<CtrctSupplierProduct>=new Array();

  constructor() {

  }
}
