import {Activity} from "./model.activity";
import {Request} from "./model.request";
import {ProduitActivity} from "./model.produitActivity";

export class ActivityRequest extends Activity{

  produit:string;
  request : Request;
  etat: boolean;
  produits:Array<ProduitActivity> = new Array();


  constructor(){
    super();
    this.request = new Request();

      this.typeActivite = "Activité support";


  }

}
