import {User} from "./model.user";
import {Formation} from "./model.formation";

export class EmpFormation {
  id:any;
  employe:User;
  formation:Formation;
  visa:string = "Accepted";
}
