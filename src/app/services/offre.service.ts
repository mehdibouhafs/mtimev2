import {Injectable} from "@angular/core";
import {host} from "./host";
import {AuthenticationService} from "./authentification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class OffreService {

  private host = host;

  constructor(public  http:HttpClient,private autehntificationService:AuthenticationService){

  }

  getOffresByCustomer(code:string){
    return this.http.get(this.host+"/offres/search/bycustomer?code="+code,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

}
