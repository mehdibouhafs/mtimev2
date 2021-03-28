import {User} from "./model.user";
import {EmpCertification} from "./model.empCertification";
import {Technologie} from "./model.technologie";
import {Editeur} from "./model.editeur";

export  class Certification{
  id:any;
  certName:string="";
  dateEch:Date;

  technologie:Technologie;
  editeur:Editeur;

  candidats: Array<EmpCertification> = new Array();

}
