import {Component, Input, OnInit} from "@angular/core";
import {Certification} from "../../../model/model.certification";
import {AuthenticationService} from "../../../services/authentification.service";

@Component({
  selector: 'show-certification-all-participants',
  templateUrl: 'show-certification-all-participants.component.html'
})

export class ShowCertificationAllParticipantsComponent {

  @Input() modal:any;
  @Input() certification:Certification;




}
