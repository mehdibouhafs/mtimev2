import {Authorisation} from "./model.authorisation";

export class User{
  username:string;
  firstName:string;
  lastName:string;
  autorisations: Array<Authorisation>;
}
