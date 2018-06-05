import {Component, Input} from "@angular/core";

@Component({
  selector: 'show-activity-holiday',
  templateUrl: 'showActivityHoliday.component.html'
})

export class ShowActivityHolidayComponent {
  @Input() modal;
  @Input() activityHoliday;

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
