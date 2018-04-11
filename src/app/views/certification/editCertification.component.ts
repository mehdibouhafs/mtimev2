import {Component, OnInit} from "@angular/core";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Certification} from "../../model/model.certification";
import {CertificationService} from "../../services/certification.service";

@Component({
  templateUrl: 'editCertification.component.html'
})
export class EditCertificationComponent implements OnInit{
  mode:number=1;
  certification : Certification = new Certification();
  idCertification :number;

  constructor(private certificationService:CertificationService,private  autehntificationService:AuthenticationService,private activateRoute:ActivatedRoute){

    this.idCertification = this.activateRoute.snapshot.params['id'];
    console.log("idCertification" + this.idCertification);
  }

  ngOnInit(){
      this.certificationService.getCertification(this.idCertification)
        .subscribe((data:Certification)=>{
          this.certification = data;
          console.log("certification " + this.certification);
        },err=>{
          console.log(err);
        });
  }

  onEditCertification() {
    this.certificationService.updateCertification(this.certification)
      .subscribe((data: Certification) => {
        console.log("ok " + data);
        this.certification = data;
        this.mode = 2;
      }), err => {
      console.log(JSON.parse(err.body).message);
    };
  }


}
