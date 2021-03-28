import {CtrctSupplierProduct} from "./model.contratFournisseurProduit";
import {CtrctCustomerProductSeries} from "./model.contratClientProduitSerie";

export class CtrctSupplierProductSeries {

  id:any;
  sn:string;
  ctrctCustomerProductSeries:CtrctCustomerProductSeries;
  ctrctSupplierProduct:CtrctSupplierProduct;

  constructor() {

  }

}
