import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Certification} from "../../../model/model.certification";
import {AuthenticationService} from "../../../services/authentification.service";
import {EmpCertification} from "../../../model/model.empCertification";
import {CertificationService} from "../../../services/certification.service";
import {Formation} from "../../../model/model.formation";
import {EmpFormation} from "../../../model/model.empFormation";
import {FormationService} from "../../../services/formation.service";

@Component({
  selector: 'manage-empformation',
  templateUrl: 'manage-empformation.component.html'
})

export class ManageEmpformationComponent implements OnInit {

  public popoverTitle: string = "Confirmation";
  public popoverMessage: string = "<b>Êtes-vous sûre de vouloir confirmer ces statuts ? </b>";

  mode:number = 1;
  @Output() refresh = new EventEmitter<string>();
  @Input() modal:any;
  @Input() formation:Formation;

  idService:number;
  empFormation:EmpFormation;

  constructor(private authenticationService:AuthenticationService, private formationService:FormationService, private ref:ChangeDetectorRef) {

  }

  ngOnInit() {
    this.idService = this.authenticationService.getIdService();
  }

  manageFormation() {
    console.log(this.formation);
    this.formation.candidats.forEach((empFormation:EmpFormation)=>{
      if(empFormation.employe.service.id==this.idService)
        this.changeStatus(empFormation);
    });
    this.mode = 2;
  }

  changeStatus(empFormation:EmpFormation) {

    var empformation:EmpFormation = JSON.parse(JSON.stringify(empFormation));
    empformation.formation = this.formation;

    console.log(empformation);
    this.formationService.validFormation(empformation).subscribe(
      data=>{
        console.log('EmpFormation est validé');
        this.refreshData();
      }, err=>{
        console.log(err);
      }
    );
  }

  getDetailsFormation() {
    let nbreEmpOnThisService:number = 0;
    let serviceName:string;
    this.formation.candidats.forEach(candidat=>{
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
