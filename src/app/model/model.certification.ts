import {User} from "./model.user";

export  class Certification{
  id:any;
  certName:string="";
  url:string="";
  dateEch:Date;
  statut:number;
  participants:Array<User> = new Array();

}
