import {Authorisation} from "./model.authorisation";
import {Service} from "./model.service";

export class User{
  username:string;
  firstName:string;
  lastName:string;
  service:Service;
  autorisations: Array<Authorisation>;


}
