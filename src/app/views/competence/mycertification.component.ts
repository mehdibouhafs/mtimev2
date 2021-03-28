import {Component} from "@angular/core";
import {CertificationService} from "../../services/certification.service";
import {Certification} from "../../model/model.certification";
import {EmpCertification} from "../../model/model.empCertification";
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router";

@Component({
  templateUrl: 'mycertification.component.html'
})

export class MycertificationComponent {

  certifications:any;

  motCle:string="";
  currentPage : number = 1;
  itemsPerPage : number = 10;
  size : number = 10;
  pages: Array<number>;

  selectedCertification:Certification = new Certification();
  selectedUsers = [];

  empCertification:EmpCertification = new EmpCertification();
  username:string;

  constructor(private router:Router, private certificationService:CertificationService, private authenticationService:AuthenticationService) {

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
    this.certificationService.getMyCertification(this.motCle, this.currentPage, this.size).subscribe(
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

  detectStatus(certification:Certification) {
    let status:string;
    certification.candidats.forEach(empCertification=>{
      if (empCertification.employe.username==this.username) {
        status = empCertification.visa;
      }
    });
    return status;
  }

  goToValidCertification(c:Certification) {
    this.selectCertification(c);
    c.candidats.forEach(empCertification=>{
      if (empCertification.employe.username==this.username) {
        this.empCertification = JSON.parse(JSON.stringify(empCertification));
        return this.empCertification.visa;
      }
    })
  }

}
