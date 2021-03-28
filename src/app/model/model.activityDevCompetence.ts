import {Activity} from "./model.activity";
import {ProduitActivity} from "./model.produitActivity";

export class ActivityDevCompetence extends Activity {

  produit:string;
  etat: boolean;
  produits:Array<ProduitActivity> = new Array();

  constructor() {
    super();
    this.typeActivite = "Activité dev competence";
  }
}
