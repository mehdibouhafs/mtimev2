import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Formation} from "../model/model.formation";
import {Certification} from "../model/model.certification";
import {EmpCertification} from "../model/model.empCertification";
import {host} from "./host";

@Injectable()
export class CertificationService {

  private host = host;

  constructor(public http:HttpClient,private autehntificationService:AuthenticationService){

  }

  getCertifications(motcle:String,page:number,size:number){
    return this.http.get(this.host+"/findCertifications?mc="+motcle+"&size="+size+"&page="+page,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  saveCertification(certification:Certification){

    return this.http.post(this.host+'/certifications',certification,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});

  }

  addCertificationToOutlook(certification:Certification) {
    return this.http.post(this.host+'/outlookCertifications',certification,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
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

  getMyCertification(motcle:String,page:number,size:number) {
    return this.http.get(this.host+"/findMyCertifications?username="+this.autehntificationService.getUserName()+"&mc="+motcle+"&size="+size+"&page="+page,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});

  }

  validCertification(empCertification:EmpCertification) {
    return this.http.put(this.host+'/validCertification', empCertification,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  getCertificationToValide(page:number,size:number) {
    return this.http.get(this.host+"/getCertificationToValide?idService="+this.autehntificationService.getIdService(),{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  getCertificationThisMonth() {
    return this.http.get(this.host+"/getCertificationThisMonth?username="+this.autehntificationService.getUserName(),{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  getCertificationNextMonth() {
    return this.http.get(this.host+"/getCertificationNextMonth?username="+this.autehntificationService.getUserName(),{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }



}
