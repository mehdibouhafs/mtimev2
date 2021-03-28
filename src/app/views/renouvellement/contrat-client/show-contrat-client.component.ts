import {Component, Input} from "@angular/core";
import {CtrctCustomer} from "../../../model/model.contratClient";
@Component({
  selector: 'show-contrat-client',
  templateUrl: 'show-contrat-client.component.html'
})
export class ShowContratClientComponent {

  @Input() contrat:CtrctCustomer;
  @Input() modal:any;

}
