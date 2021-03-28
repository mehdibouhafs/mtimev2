import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {host} from "./host";


@Injectable()
export class RequestService {

  private host = host;

  constructor(public  http:HttpClient,private autehntificationService:AuthenticationService){

  }


  getRequests(motcle:String,page:number,size:number){
    return this.http.get(this.host+"/findRequests?mc="+motcle+"&size="+size+"&page="+page,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }


  getRequest(rqtExcde:string) {
    return this.http.get(this.host + '/requests/' + rqtExcde, {headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  getRequestByCustomerCodeAndService(codeCustomer:string,serviceName :string) {
    return this.http.get(this.host + '/requests/customer/' + codeCustomer+"/service/"+serviceName, {headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  getRequestByCustomerCodeAndServiceAndNature(codeCustomer:string,serviceName :string,nature:string) {
    return this.http.get(this.host + '/requestsByNature/customer/' + codeCustomer+"/service/"+serviceName, {headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  getMyRequests(motcle:String,page:number,size:number){
    return this.http.get(this.host+"/myrequests?username="+this.autehntificationService.getUserName()+"&mc="+motcle+"&size="+size+"&page="+page,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }


}
