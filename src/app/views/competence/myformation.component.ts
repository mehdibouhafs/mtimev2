import {Component} from "@angular/core";
import {CertificationService} from "../../services/certification.service";
import {Certification} from "../../model/model.certification";
import {EmpCertification} from "../../model/model.empCertification";
import {AuthenticationService} from "../../services/authentification.service";
import {Formation} from "../../model/model.formation";
import {EmpFormation} from "../../model/model.empFormation";
import {FormationService} from "../../services/formation.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: 'myformation.component.html'
})

export class MyformationComponent {

  formations:any;

  motCle:string="";
  currentPage : number = 1;
  itemsPerPage : number = 10;
  size : number = 10;
  pages: Array<number>;

  selectedFormation:Formation = new Formation();
  selectedUsers = [];

  empFormation:EmpFormation = new EmpFormation();
  username:string;

  constructor(private router:Router, private formationService:FormationService, private authenticationService:AuthenticationService) {

  }

  ngOnInit() {
    if (!this.authenticationService.isLogged())
      this.router.navigate(['/pages/login']);
    else {
      this.doSearch();
      this.username = this.authenticationService.getUserName();
    }
  }

  doSearch() {
    this.formationService.getMyFormation(this.motCle, this.currentPage, this.size).subscribe(
      data=>{
        this.formations = data;
      }, err=>{
        console.log(err);
      }
    );
  }

  chercher() {
    this.currentPage = 1;
    this.doSearch();
  }

  gotoPage(page:number){
    this.currentPage = page;
    this.doSearch();
  }

  selectFormation(f:Formation) {
    this.selectedFormation = JSON.parse(JSON.stringify(f));
    this.selectedUsers = [];
    if (f.candidats.length>0) {
      f.candidats.forEach(candidat=>{
        this.selectedUsers.push(candidat.employe);
      });
    }
  }

  detectStatus(formation:Formation) {
    let status:string;
    formation.candidats.forEach(empFormation=>{
      if (empFormation.employe.username==this.username) {
        status = empFormation.visa;
      }
    });
    return status;
  }

}
