import {ObjectifUser} from "./model.objectifUser";

export class Objectif {

  id:any;
  name:string;
  echeance:Date;
  users: Array<ObjectifUser> = new Array();

}
