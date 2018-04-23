import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router";
import {Certification} from "../../model/model.certification";
import {CertificationService} from "../../services/certification.service";

@Component({
  templateUrl: 'allCertification.component.html'
})
export class AllCertificationComponent implements OnInit{
  pageCertifications: any;
  motCle:string="";
  currentPage : number = 1;
  itemsPerPage : number = 5;
  totalElement:number;
  size : number = 5;
  pages: Array<number>;

  public popoverTitle: string = 'Suppression de la certification';
  public popoverMessage: string = "<b>Est vous sure de vouloir supprimer cette certification </b>";
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  certification : Certification = new Certification();
  selectedCertification: Certification;

  constructor(private certificationService:CertificationService,private  autehntificationService:AuthenticationService,private router:Router ) { }

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";

  ngOnInit(){
    this.doSearch();
  }

  chercher(){
    this.doSearch();
  }

  doSearch(){
    console.log("motCle " + this.motCle);

    this.certificationService.getCertifications(this.motCle,this.currentPage,this.size).subscribe(
      data=>{
        this.pageCertifications = data;
        this.pages = new Array(data["totalPages"]);
        this.totalElement = data["totalElements"];

      },err=>{
        this.autehntificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }

  onSaveCertification(certification:Certification){
    this.certificationService.saveCertification(certification)
      .subscribe((data :Certification)=>{
        this.certification = new Certification();
        this.chercher();
      }),err=>{
      console.log(JSON.parse(err.body).message);
    }
  }

  gotoPage(page:number){
      this.currentPage = page;
      this.doSearch();
  }

  onEditCertification(id:number){
    this.router.navigate(["/certification/edit-certification/",id]);
    //this.router.navigateByUrl('/formation/edit-formation/'+id);
  }

  onDeleteCertification(certification:Certification){

        this.certificationService.deleteCertification(certification.id)
          .subscribe(data => {
            this.pageCertifications.content.splice(
              this.pageCertifications.content.indexOf(certification), 1
            )
          }, err => {
            console.log("err");
          });

  }

  doDeleteCertification(certification:Certification) {
    this.selectedCertification = certification;
  }

  doChargerModal(certification: Certification) {
    this.selectedCertification = certification;
  }


}
