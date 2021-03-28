import {Product} from "./model.produit";
import {CtrctCustomer} from "./model.contratClient";
import {CtrctCustomerProductSeries} from "./model.contratClientProduitSerie";
import {CtrctSupplierProduct} from "./model.contratFournisseurProduit";

export class CtrctCustomerProduct {

  id:any;
  product:Product;
  ctrctCustomer:CtrctCustomer;
  qte:number;
  qteDisponible : number;
  devise : string;

  ctrctCustomerProductSeries:Array<CtrctCustomerProductSeries>=new Array();

  ctrctSupplierProducts:Array<CtrctSupplierProduct>=new Array();


}
