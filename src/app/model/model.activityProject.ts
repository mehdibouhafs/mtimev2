import {Customer} from "./model.customer";
import {Project} from "./model.project";
import {Activity} from "./model.activity";
import {ProduitActivity} from "./model.produitActivity";
import {Offre} from "./model.offre";
import {Objectif} from "./model.objectif";

export class ActivityProject extends Activity{

  produit:string;
  project:Project;
  offre:Offre;
  objectif:Objectif;
  precisionProject:string;
  produits:Array<ProduitActivity> = new Array();

  constructor(){
    super();
    this.typeActivite = "Activité projet";
  }

}
