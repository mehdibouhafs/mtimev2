import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Formation} from "../model/model.formation";
import {EmpFormation} from "../model/model.empFormation";
import {host} from "./host";

@Injectable()
export class FormationService {

  private host = host;

  constructor(public  http:HttpClient,private autehntificationService:AuthenticationService){

  }

  getFormations(motcle:String,page:number,size:number){
    return this.http.get(this.host+"/findFormations?mc="+motcle+"&size="+size+"&page="+page,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  saveFormation(formation:Formation){

    return this.http.post(this.host+'/formations',formation,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});

  }

  addFormationToOutlook(formation:Formation) {
    return this.http.post(this.host+'/outlookFormations',formation,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
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

  getMyFormation(motcle:String,page:number,size:number) {
    return this.http.get(this.host+"/findMyFormations?username="+this.autehntificationService.getUserName()+"&mc="+motcle+"&size="+size+"&page="+page,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});

  }

  getFormationToValide(page:number,size:number) {
    return this.http.get(this.host+"/getFormationToValide?idService="+this.autehntificationService.getIdService(),{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  getFormationGroupe(page:number,size:number) {
    return this.http.get(this.host+"/getFormationGroupe?idService="+this.autehntificationService.getIdService(),{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  validFormation(empFormation:EmpFormation) {
    return this.http.put(this.host+"/validFormation", empFormation, {headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  getFormationThisMonth() {
    return this.http.get(this.host+"/getFormationThisMonth?username="+this.autehntificationService.getUserName(),{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  getFormationNextMonth() {
    return this.http.get(this.host+"/getFormationNextMonth?username="+this.autehntificationService.getUserName(),{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

}
