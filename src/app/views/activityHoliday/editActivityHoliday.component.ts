import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ActivityHoliday} from "../../model/model.activityHoliday";
import {ActivityService} from "../../services/activity.service";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";

@Component({
  selector: 'edit-activity-holiday',
  templateUrl: 'editActivityHoliday.component.html'
})

export class EditActivityHolidayComponent {

  mode = 1;

  @Output() refresh = new EventEmitter<string>();

  @Input() activityHoliday: ActivityHoliday = new ActivityHoliday();
  @Input() modal;
  @Input() toDo: boolean = false;
  @Input() disabledStatut: boolean = false;

  public motif = [
    {
      name: "Maladie"
    },
    {
      name: "Congé"
    },
    {
      name: "Personnel"
    }
  ];

  constructor(private activityService: ActivityService, private  autehntificationService: AuthenticationService, private activateRoute: ActivatedRoute, private ref: ChangeDetectorRef) {


  }

  hideModal() {
    this.modal.hide();
  }

  onDatesChanged() {
    if (this.activityHoliday.dteStrt != null && this.activityHoliday.dteEnd != null) {
      if (this.activityService.testDateBeforeNow(this.activityHoliday.dteStrt, this.activityHoliday.dteEnd) == true) {

        this.activityHoliday.statut = true;
        this.disabledStatut = false;

      } else {
        this.activityHoliday.statut = false;
        this.disabledStatut = true;

      }
    }
  }

  refreshActivity() {
    this.refresh.emit("Refresh Activity");
  }


  onEditActivityHoliday() {
    this.activityHoliday.updatedAt = new Date();
    this.activityHoliday.hrStrt = "00:00";
    this.activityHoliday.hrEnd = "23:59";
    this.activityHoliday.durtion = this.activityService.diffBetwenTwoDateInMinutes(this.activityHoliday.dteStrt, this.activityHoliday.dteEnd);
    this.activityService.updateActivity(this.activityHoliday)
      .subscribe((data: ActivityHoliday) => {
        this.mode = 2;
        this.refreshActivity();
        this.ref.detectChanges();
      }), err => {
      console.log(JSON.parse(err.body).message);
    };
  }

}
