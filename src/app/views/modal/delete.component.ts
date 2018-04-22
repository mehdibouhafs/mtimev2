import {Component, Input} from "@angular/core";
import {Formation} from "../../model/model.formation";

@Component({
  selector: 'delete-modal',
  templateUrl: 'delete.component.html'
})
export class DeleteComponent {
  @Input() todeleted: Formation;
  @Input() modal: any;
}
