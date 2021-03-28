import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "./authentification.service";
import {Http} from "@angular/http";
import {host} from "./host";

@Injectable()
export class DashboardService {

  private host = host;

  constructor(public  http: HttpClient, private authenticationService: AuthenticationService) {

  }

  getStatistics() {
    return this.http
      .get(this.host + "/getStatistics?username=" + this.authenticationService.getUserName(),
        {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getStatisticsForUser(username:string) {
    return this.http
      .get(this.host + "/getStatistics?username=" + username,
        {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

}
