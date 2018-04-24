import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";


@Injectable()
export class RequestService {

  private host:String = "http://localhost:8080";

  constructor(public  http:HttpClient,private autehntificationService:AuthenticationService){

  }


  getRequests(motcle:String,page:number,size:number){
    return this.http.get(this.host+"/findRequests?mc="+motcle+"&size="+size+"&page="+page,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }


  getRequest(rqtExcde:string) {
    return this.http.get(this.host + '/requests/' + rqtExcde, {headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }




}
