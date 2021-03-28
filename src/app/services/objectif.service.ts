import {Injectable} from "@angular/core";
import {host} from "./host";
import {AuthenticationService} from "./authentification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Objectif} from "../model/model.objectif";


@Injectable()
export class ObjectifService {

  private host = host;

  constructor(
    private http:HttpClient,
    private autehntificationService:AuthenticationService
  ) {}

  saveObjectif(objectif:Objectif) {
    return this.http.post(this.host+'/save-objectif', objectif, {headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  getAllObjectifs(mc:string,page:number,size:number) {
    return this.http.get(this.host+'/all-objectifs?mc='+mc+'&page='+page+'&size='+size, {headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  getMyObjectifsValide() {
    return this.http.get(this.host+'/my-objectifs-valide?username='+this.autehntificationService.getUserName(), {headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  updateTaux(id:number, taux:number) {
    return this.http.get(this.host+'/update-taux?id='+id+'&taux='+taux, {headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})})
  }

}
