import {CtrctSupplier} from "./model.contratFournisseur";
import {CtrctCustomer} from "./model.contratClient";
import {Product} from "./model.produit";
import {CtrctSupplierProductSeries} from "./model.contratFournisseurProduitSerie";
import {CtrctCustomerProduct} from "./model.contratClientProduit";

export class CtrctSupplierProduct {

  id:any;
  product:Product;
  ctrctSupplier:CtrctSupplier;
  qte:number;
  prixUnitaire:number;
  qteMax:number;

  ctrctSupplierProductSeries:Array<CtrctSupplierProductSeries>=new Array();

  ctrctCustomerProduct:CtrctCustomerProduct;

  constructor() {

  }


}
