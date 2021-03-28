import {Component, Input, OnInit} from "@angular/core";
import {Certification} from "../../../model/model.certification";
import {AuthenticationService} from "../../../services/authentification.service";
import {Formation} from "../../../model/model.formation";

@Component({
  selector: 'show-formation-all-participants',
  templateUrl: 'show-formation-all-participants.component.html'
})

export class ShowFormationAllParticipantsComponent {

  @Input() modal:any;
  @Input() formation:Formation;




}
