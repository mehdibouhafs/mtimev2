import {Component} from "@angular/core";
import {CertificationService} from "../../services/certification.service";
import {Certification} from "../../model/model.certification";
import {EmpCertification} from "../../model/model.empCertification";
import {AuthenticationService} from "../../services/authentification.service";
import {FormationService} from "../../services/formation.service";
import {Formation} from "../../model/model.formation";
import {Router} from "@angular/router";

@Component({
  templateUrl: 'manage-formation-certification.component.html'
})

export class ManageFormationCertificationComponent {

  certifications:any;
  formations:any;

  idService:number;

  motCle:string="";
  currentPage : number = 1;
  itemsPerPage : number = 5;
  size : number = 5;
  pages: Array<number>;

  motCleFormation:string="";
  currentPageFormation : number = 1;
  itemsPerPageFormation : number = 5;
  sizeFormation : number = 5;
  pagesFormation: Array<number>;

  selectedCertification:Certification = new Certification();
  selectedFormation:Formation = new Formation();
  selectedUsers = [];
  selectedUsersFormation = [];

  empCertification:EmpCertification = new EmpCertification();
  username:string;

  constructor(private router:Router, private certificationService:CertificationService, private formationService:FormationService, private authenticationService:AuthenticationService) {

  }

  ngOnInit() {
    if (!this.authenticationService.isLogged())
      this.router.navigate(['/pages/login']);
    else {
      this.idService = this.authenticationService.getIdService();
      this.doSearch();
      this.doSearchFormation();
      this.username = this.authenticationService.getUserName();
    }
  }

  doSearch() {
    this.certificationService.getCertificationToValide(this.currentPage, this.size).subscribe(
      data=>{
        this.certifications = data;
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

  selectCertification(c:Certification) {
    this.selectedCertification = JSON.parse(JSON.stringify(c));
    this.selectedUsers = [];
    if (c.candidats.length>0) {
      c.candidats.forEach(candidat=>{
        this.selectedUsers.push(candidat.employe);
      });
    }
  }

  getDetailsCertification(certification:Certification) {
    let nbreEmpOnThisService:number = 0;
    let nbreAccepted:number = 0;
    let nbreRefused:number = 0;
    let serviceName:string;
    certification.candidats.forEach(candidat=>{
      if(candidat.employe.service.id==this.idService) {
        nbreEmpOnThisService++;
        serviceName = candidat.employe.service.servName;
        if(candidat.visa=='Accepted')
          nbreAccepted++;
        if(candidat.visa=='Refused')
          nbreRefused++;
      }
    });
    return {
      nbreThisService: nbreEmpOnThisService,
      serviceName: serviceName,
      nbreAccepted: nbreAccepted,
      nbreRefused: nbreRefused
    };
  }

  doSearchFormation() {
    this.formationService.getFormationToValide(this.currentPageFormation, this.sizeFormation).subscribe(
      data=>{
        this.formations = data;
      }, err=>{
        console.log(err);
      }
    );
  }

  chercherFormation() {
    this.currentPage = 1;
    this.doSearchFormation();
  }

  gotoPageFormation(page:number){
    this.currentPageFormation = page;
    this.doSearchFormation();
  }

  selectFormation(f:Formation) {
    this.selectedFormation = JSON.parse(JSON.stringify(f));
    this.selectedUsersFormation = [];
    if (f.candidats.length>0) {
      f.candidats.forEach(candidat=>{
        this.selectedUsersFormation.push(candidat.employe);
      });
    }
  }

  getDetailsFormation(formation:Formation) {
    let nbreEmpOnThisService:number = 0;
    let nbreAccepted:number = 0;
    let nbreRefused:number = 0;
    let serviceName:string;
    formation.candidats.forEach(candidat=>{
      if(candidat.employe.service.id==this.idService) {
        nbreEmpOnThisService++;
        serviceName = candidat.employe.service.servName;
        if(candidat.visa=='Accepted')
          nbreAccepted++;
        if(candidat.visa=='Refused')
          nbreRefused++;
      }
    });
    return {
      nbreThisService: nbreEmpOnThisService,
      serviceName: serviceName,
      nbreAccepted: nbreAccepted,
      nbreRefused: nbreRefused
    };
  }

}
