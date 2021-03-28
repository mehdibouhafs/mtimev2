import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Certification} from "../../../model/model.certification";
import {AuthenticationService} from "../../../services/authentification.service";
import {EmpCertification} from "../../../model/model.empCertification";
import {CertificationService} from "../../../services/certification.service";

@Component({
  selector: 'manage-empcertification',
  templateUrl: 'manage-empcertification.component.html'
})

export class ManageEmpcertificationComponent implements OnInit {

  public popoverTitle: string = "Confirmation";
  public popoverMessage: string = "<b>Êtes-vous sûre de vouloir confirmer ces statuts ? </b>";

  mode:number = 1;
  @Output() refresh = new EventEmitter<string>();
  @Input() modal:any;
  @Input() certification:Certification;

  idService:number;
  empCertification:EmpCertification;

  constructor(private authenticationService:AuthenticationService, private certificationService:CertificationService, private ref:ChangeDetectorRef) {

  }

  ngOnInit() {
    this.idService = this.authenticationService.getIdService();
  }

  manageCertification() {
    console.log(this.certification);
    this.certification.candidats.forEach((empCertification:EmpCertification)=>{
      if(empCertification.employe.service.id==this.idService)
        this.changeStatus(empCertification);
    });
    this.mode = 2;
  }

  changeStatus(empCertification:EmpCertification) {

    var empcertification:EmpCertification = JSON.parse(JSON.stringify(empCertification));
    empcertification.certification = this.certification;

    this.certificationService.validCertification(empcertification).subscribe(
      data=>{
        console.log('EmpCertification est validé');
        this.refreshData();
      }, err=>{
        console.log(err);
      }
    );
  }

  getDetailsCertification() {
    let nbreEmpOnThisService:number = 0;
    let serviceName:string;
    this.certification.candidats.forEach(candidat=>{
      if(candidat.employe.service.id==this.idService) {
        nbreEmpOnThisService++;
        serviceName = candidat.employe.service.servName;
      }
    });
    return {
      nbreThisService: nbreEmpOnThisService,
      serviceName: serviceName
    };
  }

  refreshData() {
    this.refresh.emit("Refresh");
  }

}
