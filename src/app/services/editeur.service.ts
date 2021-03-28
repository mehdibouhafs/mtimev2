import {Injectable} from "@angular/core";
import {Technologie} from "../model/model.technologie";
import {AuthenticationService} from "./authentification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {host} from "./host";

@Injectable()
export class EditeurService {

  private host = host;

  constructor(private http:HttpClient, private authenticationService:AuthenticationService) {

  }

  getEditeursByTechnologie(technologie:Technologie) {
    return this.http.get(this.host+"/technologies/"+technologie.idTechnologie+"/editeurs",{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

}
