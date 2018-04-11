import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Formation} from "../model/model.formation";
import {Certification} from "../model/model.certification";

@Injectable()
export class CertificationService {

  private host:String = "http://localhost:8080";

  constructor(public http:HttpClient,private autehntificationService:AuthenticationService){

  }

  getCertifications(motcle:String,page:number,size:number){
    return this.http.get(this.host+"/findCertifications?mc="+motcle+"&size="+size+"&page="+page,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  saveCertification(certification:Certification){

    return this.http.post(this.host+'/certifications',certification,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});

  }

  getCertification(id:number){
    return this.http.get(this.host+'/certifications/'+id,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  updateCertification(certification:Certification){
    console.log("certifications a updaté "+JSON.stringify(certification));
    return this.http.put(this.host+'/certifications/'+certification.id,certification,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  deleteCertification(id:number){
    return this.http.delete(this.host+'/certifications/'+id,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  testeSocket(){
    return this.http.post(this.host+'/some-action',{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }



}
