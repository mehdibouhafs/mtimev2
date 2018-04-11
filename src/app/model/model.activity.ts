import {User} from "./model.user";
import {Customer} from "./model.customer";

export class Activity {
  id:any;
  typeActivite:string;
  dteStrt:Date;
  dteEnd:Date;
  hrStrt:string;
  hrEnd:string;
  duration:string;
  user : User;
  customer:Customer;
  nature:string;
  lieu:string;
  ville:string;
  statut:boolean;
  comments:string;

  constructor(){
    this.customer = new Customer();
    this.user = new User();
  }


}
