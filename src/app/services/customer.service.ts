import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Customer} from "../model/model.customer";
import {host} from "./host";

@Injectable()
export class CustomerService {

  private host = host;

  constructor(public  http:HttpClient,private autehntificationService:AuthenticationService){

  }

  searchCustomer(name:string){
    return this.http.get(this.host+"/customers/search/startwith?name="+name,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  searchSupplier(name:string){
    return this.http.get(this.host+"/customers/search/supplierstartwith?name="+name,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  getCustomers(){
    return this.http.get(this.host+"/customers?size=5",{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  saveCustomer(customer:Customer){
    return this.http.post(this.host+'/customers',customer,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  getCustomer(id:number){
    return this.http.get(this.host+'/Customers/'+id,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  updateCustomer(customer:Customer){
    console.log("Customer a updaté "+JSON.stringify(customer));
    return this.http.put(this.host+'/customers/'+customer.code,customer,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }

  deleteCustomer(id:number){
    return this.http.delete(this.host+'/customers/'+id,{headers: new HttpHeaders({'Authorization': this.autehntificationService.getToken()})});
  }



}
