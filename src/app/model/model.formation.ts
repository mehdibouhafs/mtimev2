import {User} from "./model.user";
import {Technologie} from "./model.technologie";
import {Editeur} from "./model.editeur";
import {EmpFormation} from "./model.empFormation";
import {DateFormation} from "./model.dateFormation";

export class Formation {
  id: any;
  frmName: string = "";
  hasCertif: boolean = false;
  technologie:Technologie;
  editeur:Editeur;
  candidats: Array<EmpFormation> = new Array();
  dates: Array<DateFormation> = new Array();
}
