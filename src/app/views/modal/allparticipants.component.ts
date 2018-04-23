import {Component, Input} from "@angular/core";
import {Formation} from "../../model/model.formation";

@Component({
  selector: 'all-participants',
  templateUrl: 'allparticipants.component.html'
})

export class AllparticipantsComponent {
  @Input() modal: any;
  @Input() selectedEntity: any;

  hideModal() {
    this.modal.hide();
  }
}
