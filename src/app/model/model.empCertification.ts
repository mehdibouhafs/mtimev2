import {Certification} from "./model.certification";
import {User} from "./model.user";

export class EmpCertification {
  id:any;
  niveau:string="";
  url_image_certif:string="";
  employe:User;
  certification:Certification;
  visa:string = "Accepted";
}
