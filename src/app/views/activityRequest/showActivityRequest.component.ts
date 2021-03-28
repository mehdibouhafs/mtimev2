import {ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {ActivityRequest} from "../../model/model.activityRequest";
import {AuthenticationService} from "../../services/authentification.service";
@Component({
  selector: 'show-activity-request',
  templateUrl: 'showActivityRequest.component.html'
})
export class ShowActivityRequestComponent implements OnInit{
  @Input() modal;
  @Input() activityRequest:ActivityRequest = new ActivityRequest();

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
