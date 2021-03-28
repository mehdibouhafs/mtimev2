import {Injectable} from "@angular/core";
import {host} from "./host";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "./authentification.service";
import {CtrctCustomer} from "../model/model.contratClient";
import {CtrctSupplier} from "../model/model.contratFournisseur";

@Injectable()
export class RenouvellementService {

  private host = host;

  constructor(public http:HttpClient, private authentificationService:AuthenticationService) {}

  saveContratClient(ctrctCustomer:CtrctCustomer) {
    return this.http.post(this.host+'/save-contrat-client', ctrctCustomer,{headers: new HttpHeaders({'Authorization': this.authentificationService.getToken()})});
  }

  getProducts(mc:string) {
    return this.http.get(this.host+"/products?mc="+mc, {headers: new HttpHeaders({'Authorization': this.authentificationService.getToken()})});
  }

  getDistributeur(mc:string) {
    return this.http.get(this.host+"/distributeurs?mc="+mc, {headers: new HttpHeaders({'Authorization': this.authentificationService.getToken()})});
  }

  getAllContratClient() {
    return this.http.get(this.host+"/getAllContratClient", {headers: new HttpHeaders({'Authorization': this.authentificationService.getToken()})});
  }

  saveContratFournisseur(ctrctSupplier:CtrctSupplier) {
    return this.http.post(this.host+'/save-contrat-fournisseur', ctrctSupplier,{headers: new HttpHeaders({'Authorization': this.authentificationService.getToken()})});
  }

  getContratClientByClient(code:string) {
    return this.http.get(this.host+"/getContratClientByClient?code="+code, {headers: new HttpHeaders({'Authorization': this.authentificationService.getToken()})});
  }

  getAllContratClientWithStatutContratFournisseur(statut:String) {
    return this.http.get(this.host+"/getAllCrtCustomerByStatut?statut="+statut, {headers: new HttpHeaders({'Authorization': this.authentificationService.getToken()})});
  }


  saveContratClientFromFile() {
    return this.http.get(this.host+"/saveContratClientFromFile", {headers: new HttpHeaders({'Authorization': this.authentificationService.getToken()})});
  }



}
