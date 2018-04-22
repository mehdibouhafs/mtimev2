import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "./authentification.service";

@Injectable()
export class UserService {

  private host:String = "http://localhost:8080";

  constructor( public http:HttpClient, private autehntificationService:AuthenticationService ){

  }

  getAllUsers(){
    return this.http.get(this.host+"/allusers",{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  findMyFormations(motcle:String,page:number,size:number) {

    /*let URL:String = "/myformations?username="+this.autehntificationService.getUserName()
      +"&mc="+motcle
      +"&size="+size
      +"&page="+page;*/
    return this.http.get(this.host+"/myformations?username="+this.autehntificationService.getUserName()
      +"&mc="+motcle
      +"&size="+size
      +"&page="+page, {headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

}
