import {ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {ActivityRequest} from "../../model/model.activityRequest";
import {ActivityPM} from "../../model/model.activityPM";
import {AuthenticationService} from "../../services/authentification.service";
@Component({
  selector: 'show-activity-pm',
  templateUrl: 'showActivityPM.component.html'
})
export class ShowActivityPMComponent implements OnInit{
  @Input() modal;
  @Input() activityPM:ActivityPM = new ActivityPM();

  serviceName:any;
  role:any;

  constructor(
    private authenticationService: AuthenticationService, private ref: ChangeDetectorRef) {

  }

  ngOnInit(){
    this.serviceName = this.authenticationService.getServName();
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
