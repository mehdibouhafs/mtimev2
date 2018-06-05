import {Component, Input} from "@angular/core";
import {ActivitySI} from "../../model/model.activitySI";

@Component({
  templateUrl: 'showActivitySI.component.html',
  selector: 'show-activity-si'
})

export class ShowActivitySIComponent {
  @Input() modal;
  @Input() activitySI:ActivitySI = new ActivitySI();

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
