import {User} from "./model.user";

export  class Formation{
   id:any;
   frmName:string="";
   dateStrt:Date;
   dateEnd:Date;
   hasCertif:boolean=false;
   participants:Array<User> = new Array();


}
