import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "./authentification.service";
import {Http} from "@angular/http";

@Injectable()
export class DashboardService {

  private host: String = "http://localhost:8080";

  constructor(public  http: HttpClient, private authenticationService: AuthenticationService) {

  }

  getStatistics() {
    return this.http
      .get(this.host + "/getStatistics?username=" + this.authenticationService.getUserName(),
        {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

}
