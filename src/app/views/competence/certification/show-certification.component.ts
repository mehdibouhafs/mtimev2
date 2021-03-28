import {Component, Input, OnInit} from "@angular/core";
import {Certification} from "../../../model/model.certification";
import {AuthenticationService} from "../../../services/authentification.service";

@Component({
  selector: 'show-certification',
  templateUrl: 'show-certification.component.html'
})

export class ShowCertificationComponent {

  @Input() modal:any;
  @Input() certification:Certification;

  getCertificationDetails() {
    let nbrAccepted:number = 0;
    this.certification.candidats.forEach(candidat=>{
      if(candidat.visa=='Accepted')
        nbrAccepted++;
    });
    return {
      nbreAccepted: nbrAccepted
    };
  }

}
