import {Injectable, ViewChild} from "@angular/core";
import {AuthenticationService} from "./authentification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {host} from "./host";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ModalDirective} from "ngx-bootstrap";


@Injectable()
export class ProduitService {

  private host = host;

   myModal:ModalDirective;

  constructor(private http:HttpClient, private authenticationService:AuthenticationService) {}

  getProduits() {
    return this.http.get(this.host+"/produits/search/all?servName="+this.authenticationService.getServName(), {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  setModal(modal:any) {

    this.myModal=modal;

  }

  showModal() {

    this.myModal.show();

  }

}
