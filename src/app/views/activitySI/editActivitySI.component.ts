import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from "@angular/core";
import {ActivityService} from "../../services/activity.service";
import {CustomerService} from "../../services/customer.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentification.service";
import * as moment from "moment-timezone";
import {ActivitySI} from "../../model/model.activitySI";

@Component({
  templateUrl: 'editActivitySI.component.html',
  selector: 'edit-activity-si'
})

export class EditActivitySIComponent {

  @Output() refresh = new EventEmitter<string>();

  @Input() modal;
  @Input() activitySI: any;
  @Input() toDo: boolean = false;
  @Input() disabledStatut: boolean = false;

  message: string;
  currentDate: Date = new Date();
  dureeFormated: string;
  error: number = 0;
  mode: number = 1;
  returnedError: string;

  duree: number;
  @Input() dureeConverted: string;

  constructor(private activityService: ActivityService, private customerService: CustomerService, private router: Router, private authenticationService: AuthenticationService, private ref: ChangeDetectorRef) {

  }

  hideModal() {
    this.modal.hide();
    this.error = 0;
  }

  onDatesChanged() {
    console.log("onDatesChanged ");
    if (this.activitySI.dteStrt != null && this.activitySI.dteEnd != null) {
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activitySI.dteStrt, this.activitySI.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activitySI.dteStrt, this.activitySI.dteEnd) == true) {

        this.activitySI.statut = true;
        this.disabledStatut = false;

      } else {
        this.activitySI.statut = false;
        this.disabledStatut = true;

      }
    }
  }

  refreshActivity() {
    this.refresh.emit("Rafresh Activity");
  }

  onEditActivitySI() {
    this.activitySI.updatedAt = new Date();
    this.activitySI.hrStrt = moment(this.activitySI.dteStrt).format("HH:mm");
    this.activitySI.hrEnd = moment(this.activitySI.dteEnd).format("HH:mm");
    this.activitySI.durtion = this.activityService.diffBetwenTwoDateInMinutes(this.activitySI.dteStrt, this.activitySI.dteEnd);
    this.activityService.updateActivity(this.activitySI)
      .subscribe((data: ActivitySI) => {
        this.refreshActivity();
        this.mode = 2;
        this.ref.detectChanges();
      }, err => {
        console.log(JSON.stringify(err));
        this.returnedError = err.error.message;
        this.error = 1;
      });
  }
}
