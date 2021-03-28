import {Component, Input, OnInit} from "@angular/core";
import {Certification} from "../../../model/model.certification";
import {AuthenticationService} from "../../../services/authentification.service";
import {Formation} from "../../../model/model.formation";

@Component({
  selector: 'show-formation',
  templateUrl: 'show-formation.component.html'
})

export class ShowFormationComponent {

  @Input() modal:any;
  @Input() formation:Formation;

  getFormationDetails() {
    let nbrAccepted:number = 0;
    this.formation.candidats.forEach(candidat=>{
      if(candidat.visa=='Accepted')
        nbrAccepted++;
    });
    return {
      nbreAccepted: nbrAccepted
    };
  }

}
