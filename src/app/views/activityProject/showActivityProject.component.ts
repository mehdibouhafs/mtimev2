import {ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivityProject} from "../../model/model.activityProject";
import {ActivityService} from "../../services/activity.service";
import * as moment from "moment-timezone";
@Component({
  selector: 'show-activity-project',
  templateUrl: 'showActivityProject.component.html'
})
export class ShowActivityProjectComponent  implements OnInit{

  @Input() modal;
  @Input() activityProject: ActivityProject;
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
