import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {host} from "./host";

@Injectable()
export class ActionService {

  private host = host;

  constructor(private http:HttpClient, private authenticationService:AuthenticationService) {}

  getActions() {
    return this.http.get(this.host+"/actions/search/all", {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

}
