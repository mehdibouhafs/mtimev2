import {Component, Input} from "@angular/core";
import {ActivityCommercial} from "../../model/model.activityCommercial";

@Component({
  selector: 'show-activity-commercial',
  templateUrl: 'showActivityCommercial.component.html'
})

export class ShowActivityCommercialComponent {

  @Input() modal;
  @Input()
  activityCommercial: ActivityCommercial;

  constructor() {

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
