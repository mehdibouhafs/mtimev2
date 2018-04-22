import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Formation} from "../model/model.formation";

@Injectable()
export class FormationService {

  private host:String = "http://localhost:8080";

  constructor(public  http:HttpClient,private autehntificationService:AuthenticationService){

  }

  getFormations(motcle:String,page:number,size:number){
    return this.http.get(this.host+"/findFormations?mc="+motcle+"&size="+size+"&page="+page,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  saveFormation(formation:Formation){

    return this.http.post(this.host+'/formations', formation,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});

  }

  getFormation(id:number){
    return this.http.get(this.host+'/formations/'+id,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  updateFormation(formation:Formation){
    console.log("Formation a updaté "+JSON.stringify(formation));
    return this.http.put(this.host+'/formations/'+formation.id,formation,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  deleteFormation(id:number){
    return this.http.delete(this.host+'/formations/'+id,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

}
