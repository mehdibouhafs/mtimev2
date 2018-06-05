import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthenticationService} from "../../services/authentification.service";
import {NotificationsService} from "angular2-notifications";
import {SocketService} from "../../services/socket.service";
import {Client, Frame, Message} from "stompjs";
import {Subject} from "rxjs/Subject";
import {ActivityProject} from "../../model/model.activityProject";
import {ActivityService} from "../../services/activity.service";
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../model/model.customer";
import {Router} from "@angular/router";
import {ProjectService} from "../../services/project.service";
import {DateTimeAdapter} from "ng-pick-datetime";
import * as moment from "moment-timezone";
import {ActivityCommercial} from "../../model/model.activityCommercial";
import {AppAsideComponent} from "../../components/app-aside/app-aside.component";

@Component({
  selector: "new-activtyCommercial",
  templateUrl: 'newActivityCommercial.component.html',
})
export class NewActivityCommercialComponent implements OnInit, OnDestroy {

  @Input() modal;
  @Input() lastActivity;



  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  activityCommercial: ActivityCommercial = new ActivityCommercial();
  frmName: any;
  mode: number = 1;
  message: string;
  customers: any;
  projects: any;
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
    this.activityCommercial.id = null;
    this.duree = null;
    this.dureeConverted = null;
  }

  toModeOne() {
    this.error = 0;
    this.mode = 1;
    this.loadCustomers();
    this.activityCommercial = new ActivityCommercial();
    this.activityCommercial.user.username = this.authenticationService.getUserName();
    this.activityCommercial.dteStrt = new Date();
    this.activityCommercial.ville = "Fes";
    this.activityCommercial.statut = true;
    this.activityCommercial.nature = "Projet";
    this.activityCommercial.lieu = "Client";
    this.activityCommercial.typeActivite = "Activité commerciale";
    this.activityCommercial.comments = "Teste";
    this.duree = null;
    this.dureeConverted = null;
  }

  ngOnDestroy() {

  }

  onTestSocket() {

  }

  ngOnInit() {
    this.loadCustomers();
    this.activityCommercial.user.username = this.authenticationService.getUserName();
    this.activityCommercial.dteStrt = new Date();
    this.activityCommercial.statut = false;
    this.activityCommercial.ville = "Fes";
    this.activityCommercial.statut = true;
    this.activityCommercial.nature = "Projet";
    this.activityCommercial.lieu = "Client";
    this.activityCommercial.typeActivite = "Activité commerciale";
    this.activityCommercial.comments = "Teste";
  }

  teste() {

  }

  onDatesChanged() {
    console.log("onDatesChanged ");
    if (this.activityCommercial.dteStrt != null && this.activityCommercial.dteEnd != null) {
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activityCommercial.dteStrt, this.activityCommercial.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activityCommercial.dteStrt, this.activityCommercial.dteEnd) == true) {

        this.activityCommercial.statut = true;

      } else {
        this.activityCommercial.statut = false;

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

  onSaveActivityCommercial() {
    this.activityCommercial.createdAt = new Date();
    this.activityCommercial.updatedAt = new Date();
    this.dureeFormated = this.activityService.diffBetwenTwoDateFormated(this.activityCommercial.dteStrt, this.activityCommercial.dteEnd);
    console.log("Activity Commercial " + JSON.stringify(this.activityCommercial));
    console.log("diffBetwenTwoDateInMinutes " + this.activityService.diffBetwenTwoDateInMinutes(this.activityCommercial.dteStrt, this.activityCommercial.dteEnd));

    console.log("Date SAved " + this.activityCommercial.dteStrt);
    this.activityCommercial.hrStrt = moment(this.activityCommercial.dteStrt).format("HH:mm");
    this.activityCommercial.hrEnd = moment(this.activityCommercial.dteEnd).format("HH:mm");
    this.activityCommercial.durtion = this.activityService.diffBetwenTwoDateInMinutes(this.activityCommercial.dteStrt, this.activityCommercial.dteEnd);
    console.log("duration " + this.activityCommercial.durtion);
    this.activityService.saveActivity(this.activityCommercial)
      .subscribe((data: ActivityCommercial) => {
        console.log("ok resp " + JSON.stringify(data));
        this.activityCommercial = data;
        this.activityCommercial.typeActivite = "Activité commerciale";
        this.mode = 2;
        this.ref.detectChanges();
      }, (err: any) => {
        console.log("error " + JSON.stringify(err));
        this.returnedError = err.error.message;
        this.error = 2;

      });


  }


}
