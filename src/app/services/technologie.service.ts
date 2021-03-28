import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {host} from "./host";

@Injectable()
export class TechnologieService {

  private host = host;

  constructor(private http:HttpClient, private authenticationService:AuthenticationService) {

  }

  searchTechnologie(name:string) {
    return this.http.get(this.host+"/technologies/search/startwith?name="+name,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }


}
