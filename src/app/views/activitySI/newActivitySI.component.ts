import {ChangeDetectorRef, Component, Input} from "@angular/core";
import {ActivitySI} from "../../model/model.activitySI";
import {ActivityService} from "../../services/activity.service";
import {NotificationsService} from "angular2-notifications";
import {SocketService} from "../../services/socket.service";
import {CustomerService} from "../../services/customer.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentification.service";
import {ProjectService} from "../../services/project.service";
import * as moment from "moment-timezone";
import {Customer} from "../../model/model.customer";

@Component({
  selector: 'new-activity-si',
  templateUrl: 'newActivitySI.component.html'
})

export class NewActivitySIComponent {

  @Input() modal;
  @Input() lastActivity;



  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  activitySI: ActivitySI = new ActivitySI();
  frmName: any;
  mode: number = 1;
  message: string;
  currentDate: Date = new Date();
  disabledStatut: boolean = false;
  dureeFormated: string;
  error: number = 0;
  returnedError: string;

  duree: number;
  dureeConverted: string;


  constructor(private activityService: ActivityService, private notificationService: NotificationsService,
              private socketService: SocketService, private customerService: CustomerService, private router: Router,
              private authenticationService: AuthenticationService, private projectService: ProjectService, private ref:ChangeDetectorRef) {
  }



  hideModal() {
    this.modal.hide();
  }

  toModeDupliquer() {
    this.mode = 1;
    this.activitySI.id = null;
    this.duree = null;
    this.dureeConverted = null;
  }

  toModeOne() {
    this.error = 0;
    this.mode = 1;
    this.activitySI = new ActivitySI();
    this.activitySI.user.username = this.authenticationService.getUserName();
    this.activitySI.dteStrt = new Date();
    this.activitySI.ville = "Casablanca";
    this.activitySI.statut = true;
    this.activitySI.nature = "Support SI";
    this.activitySI.lieu = "Munisys";
    this.activitySI.typeActivite = "Activité SI";
    this.activitySI.comments = "Teste";
    this.duree = null;
    this.dureeConverted = null;
  }

  ngOnDestroy() {

  }

  onTestSocket() {

  }

  ngOnInit() {
    this.activitySI.user.username = this.authenticationService.getUserName();
    this.activitySI.dteStrt = new Date();
    this.activitySI.ville = "Casablanca";
    this.activitySI.statut = true;
    this.activitySI.nature = "Support SI";
    this.activitySI.lieu = "Munisys";
    this.activitySI.typeActivite = "Activité SI";
    this.activitySI.comments = "Teste";
  }

  teste() {

  }

  onDatesChanged() {
    console.log("onDatesChanged ");
    if (this.activitySI.dteStrt != null && this.activitySI.dteEnd != null) {
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activitySI.dteStrt, this.activitySI.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activitySI.dteStrt, this.activitySI.dteEnd) == true) {

        this.activitySI.statut = true;

      } else {
        this.activitySI.statut = false;

      }
    }
  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? "icon-arrow-down" : "icon-arrow-up";
  }

  onSaveActivitySI() {
    this.activitySI.customer = new Customer();
    this.activitySI.customer.code = "05959";
    this.activitySI.createdAt = new Date();
    this.activitySI.updatedAt = new Date();
    this.dureeFormated = this.activityService.diffBetwenTwoDateFormated(this.activitySI.dteStrt, this.activitySI.dteEnd);
    console.log("Activity SI " + JSON.stringify(this.activitySI));
    console.log("diffBetwenTwoDateInMinutes " + this.activityService.diffBetwenTwoDateInMinutes(this.activitySI.dteStrt, this.activitySI.dteEnd));

    console.log("Date SAved " + this.activitySI.dteStrt);
    this.activitySI.hrStrt = moment(this.activitySI.dteStrt).format("HH:mm");
    this.activitySI.hrEnd = moment(this.activitySI.dteEnd).format("HH:mm");
    this.activitySI.durtion = this.activityService.diffBetwenTwoDateInMinutes(this.activitySI.dteStrt, this.activitySI.dteEnd);
    console.log("duration " + this.activitySI.durtion);
    this.activityService.saveActivity(this.activitySI)
      .subscribe((data: ActivitySI) => {
        console.log("ok resp " + JSON.stringify(data));
        this.activitySI = data;
        this.activitySI.typeActivite = "Activité SI";
        this.mode = 2;
        this.ref.detectChanges();
      }, (err: any) => {
        console.log("error " + JSON.stringify(err));
        this.returnedError = err.error.message;
        this.error = 2;

      });


  }

}
