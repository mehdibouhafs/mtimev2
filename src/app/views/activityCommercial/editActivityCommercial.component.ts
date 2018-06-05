import {ChangeDetectorRef, Component, Input} from "@angular/core";
import {ActivityService} from "../../services/activity.service";
import {CustomerService} from "../../services/customer.service";
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router";
import {ActivityCommercial} from "../../model/model.activityCommercial";
import moment = require("moment");

@Component({
  selector: 'edit-activity-commercial',
  templateUrl: 'editActivityCommercial.component.html'
})

export class EditActivityCommercialComponent {

  @Input() modal;
  @Input() activityCommercial;
  @Input() pageActivities: any;
  @Input() index:any;
  @Input() toDo:boolean = false;
  @Input() disabledStatut = false;
  message: string;
  customers: any;
  projects: any;
  currentDate: Date = new Date();
  dureeFormated: string;
  error: number = 0;
  mode: number = 1;
  returnedError: string;

  duree: number;
  dureeConverted: string;

  constructor(private activityService: ActivityService, private customerService: CustomerService, private router: Router, private authenticationService: AuthenticationService, private ref:ChangeDetectorRef) {

  }

  hideModal() {
    this.modal.hide();
  }

  onDatesChanged() {
    console.log("onDatesChanged ");
    if (this.activityCommercial.dteStrt != null && this.activityCommercial.dteEnd != null) {
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activityCommercial.dteStrt, this.activityCommercial.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activityCommercial.dteStrt, this.activityCommercial.dteEnd) == true) {

        this.activityCommercial.statut = true;
        this.disabledStatut = false;

      } else {
        this.activityCommercial.statut = false;
        this.disabledStatut = true;
      }
    }
  }


  loadCustomers() {
    this.customerService.getCustomers().subscribe(
      data => {
        this.customers = data["_embedded"]["customers"];
        console.log("customers " + JSON.stringify(this.customers));
      }, err => {
        this.authenticationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }

  onEditActivityCommercial() {
    this.activityCommercial.updatedAt = new Date();
    this.activityCommercial.hrStrt = moment(this.activityCommercial.dteStrt).format("HH:mm");
    this.activityCommercial.hrEnd = moment(this.activityCommercial.dteEnd).format("HH:mm");
    this.activityCommercial.durtion = this.activityService.diffBetwenTwoDateInMinutes(this.activityCommercial.dteStrt, this.activityCommercial.dteEnd);
    this.activityService.updateActivity(this.activityCommercial)
      .subscribe((data: ActivityCommercial) => {
        this.mode = 2;
        this.pageActivities.content.splice(this.index, 1, this.activityCommercial);
        this.ref.detectChanges();
      }), err => {
      console.log(JSON.parse(err.body).message);
    };
  }
}
