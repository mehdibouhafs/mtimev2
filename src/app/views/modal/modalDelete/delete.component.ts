import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Certification} from "../../../model/model.certification";
import {Formation} from "../../../model/model.formation";

@Component({
  selector: 'delete-modal',
  templateUrl: 'delete.component.html'
})
export class DeleteComponent {
  @Input() modal: any;
  @Input() activity: any;
  @Input() certification:Certification;
  @Input() formation:Formation;

  @Output()
  functionDelete = new EventEmitter<String>();

  callFunctionDelete() {
    this.functionDelete.emit("Deleted");
  }

  hideModal() {
    this.modal.hide();
  }

  ShortconvertMinutesToHoursAndMinute(duree:number) {
    let days:number, hours:number, minutes:number;

    days = Math.floor(duree/1440);
    duree = duree%1440;

    hours = Math.floor(duree/60);
    duree = duree%60;

    minutes = duree;

    if (days>0) {
      return days + 'j ' + hours + 'h ' + minutes + 'm';
    }

    else {
      return hours + 'h ' + minutes + 'm';
    }
  }
}
