import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "./authentification.service";
import {host} from "./host";

@Injectable()
export class NatureService {

  private host = host;

  constructor(private http:HttpClient, private authenticationService:AuthenticationService) {}

  getNatureParType(type:string) {
    return this.http.get(this.host+"/nature/search/findByType?type="+type+"&service="+this.authenticationService.getServName(), {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

}
