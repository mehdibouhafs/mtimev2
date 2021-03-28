import {Component, Input, OnInit} from "@angular/core";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivityProject} from "../../model/model.activityProject";
import {ActivityService} from "../../services/activity.service";
import * as moment from "moment-timezone";
import {ActivityDevCompetence} from "../../model/model.activityDevCompetence";

@Component({
  selector: 'show-activity-dev-competence',
  templateUrl: 'showActivityDevCompetence.component.html'
})
export class ShowActivityDevCompetenceComponent {

  @Input() modal;
  @Input() activityDevCompetence: ActivityDevCompetence;

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
