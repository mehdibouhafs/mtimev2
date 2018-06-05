import {ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../../services/authentification.service";
import {NotificationsService} from "angular2-notifications";
import {SocketService} from "../../services/socket.service";
import {Client, Frame, Message} from "stompjs";
import {Subject} from "rxjs/Subject";
import {ActivityRequest} from "../../model/model.activityRequest";
import {ActivityService} from "../../services/activity.service";
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../model/model.customer";
import {Router} from "@angular/router";
import {DateTimeAdapter} from "ng-pick-datetime";
import * as moment from "moment-timezone";
import {RequestService} from "../../services/request.service";
import {Request} from "../../model/model.request";
import {FormControl, FormGroup} from "@angular/forms";

;

@Component({
  selector: "new-activityRequest",
  templateUrl: 'newActivityRequest.component.html',
})
export class NewActivityRequestComponent implements OnInit, OnDestroy {

  @Input() modal;
  @Input() lastActivity;

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  @Input()
  activityRequest: ActivityRequest = new ActivityRequest();
  frmName: any;
  mode: number = 1;
  message: string;
  customers: any;
  currentDate: Date = new Date();
  disabledStatut: boolean = false;
  dureeFormated: string;
  error: number = 0;
  returnedError: string;
  requestOk: boolean;

  duree: number;
  dureeConverted: string;

  @ViewChild('rqtExcde') rqtExcde;
  @ViewChild('requestModal') requestModal;


  //activityRequest.dteStrt = new Date(); //new Date(2010, 11, 28, 14, 57);
  //activityRequest.dteEnd = new Date(); //new Date(2010, 11, 28, 14, 57);

  constructor(private activityService: ActivityService, private notificationService: NotificationsService,
              private socketService: SocketService, private customerService: CustomerService, private router: Router,
              private authenticationService: AuthenticationService, private requestService: RequestService, private ref:ChangeDetectorRef) {
  }

  hideModal() {
    this.modal.hide();
  }

  ngOnDestroy() {

  }

  detectModal() {
    return this.requestModal.show();
  }

  onTestSocket() {

  }

  ngOnInit() {
    this.loadCustomers();
    this.activityRequest.user.username = this.authenticationService.getUserName();
    this.activityRequest.dteStrt = new Date();
    this.activityRequest.statut = false;
    this.activityRequest.ville = "Fes";
    this.activityRequest.statut = true;
    this.activityRequest.nature = "Projet";
    this.activityRequest.lieu = "Client";
    this.activityRequest.typeActivite = "Activité support";
    this.activityRequest.comments = "Teste";
    this.activityRequest.request.rqtExcde = "1111111112";
  }

  toModeDupliquer() {
    this.duree = null;
    this.dureeConverted = null;
    this.mode=1;
    this.activityRequest.id = null;
  }

  toModeOne() {
    this.error = 0;
    this.mode = 1;
    this.loadCustomers();
    this.activityRequest = new ActivityRequest();
    this.activityRequest.user.username = this.authenticationService.getUserName();
    this.activityRequest.dteStrt = new Date();
    this.activityRequest.ville = "Fes";
    this.activityRequest.statut = true;
    this.activityRequest.nature = "Projet";
    this.activityRequest.lieu = "Client";
    this.activityRequest.typeActivite = "Activité support";
    this.activityRequest.comments = "Teste";
    this.activityRequest.request.rqtExcde = "1111111112";
    this.requestOk = false;
  }


  onDatesChanged() {
    console.log("onDatesChanged ");
    if (this.activityRequest.dteStrt != null && this.activityRequest.dteEnd != null) {
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activityRequest.dteStrt, this.activityRequest.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activityRequest.dteStrt, this.activityRequest.dteEnd) == true) {

        this.activityRequest.statut = true;
        this.disabledStatut = false;

      } else {
        this.activityRequest.statut = false;
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

  onSaveActivityRequest() {
    this.activityRequest.createdAt = new Date();
    this.activityRequest.updatedAt = new Date();
    this.dureeFormated = this.activityService.diffBetwenTwoDateFormated(this.activityRequest.dteStrt, this.activityRequest.dteEnd);
    console.log("Activity Support " + JSON.stringify(this.activityRequest));
    console.log("diffBetwenTwoDateInMinutes " + this.activityService.diffBetwenTwoDateInMinutes(this.activityRequest.dteStrt, this.activityRequest.dteEnd));
    //this.activityRequest.dteStrt = new Date(this.activityService.formatDate(this.activityRequest.dteStrt));
    //this.activityRequest.dteEnd = new Date(this.activityService.formatDate(this.activityRequest.dteEnd));
    console.log("Date SAved " + this.activityRequest.dteStrt);
    this.activityRequest.hrStrt = moment(this.activityRequest.dteStrt).format("HH:mm");
    this.activityRequest.hrEnd = moment(this.activityRequest.dteEnd).format("HH:mm");
    this.activityRequest.durtion = this.activityService.diffBetwenTwoDateInMinutes(this.activityRequest.dteStrt, this.activityRequest.dteEnd);
    console.log("duration " + this.activityRequest.durtion);
    this.activityService.saveActivity(this.activityRequest)
      .subscribe((data:ActivityRequest) => {
        console.log("ok resp " + JSON.stringify(data));
        this.activityRequest = data;
        this.activityRequest.typeActivite = "Activité support";
        this.mode = 2;
        this.ref.detectChanges();

      }, (err: any) => {
        console.log("error " + JSON.stringify(err));
        this.returnedError = err.error.message;
        this.error = 2;

      });
  }


  onSearchRequest($event) {

    if (this.activityRequest.request.rqtExcde.length == 10) {
      this.requestService.getRequest(this.activityRequest.request.rqtExcde).subscribe(
        (data: Request) => {
          console.log("Request " + JSON.stringify(data));
          this.activityRequest.request = data;
          this.requestOk = true;
          this.ref.detectChanges();
          //console.log("projects customer " + JSON.stringify(this.projects));
        }, err => {
          // this.authenticationService.logout();
          //this.router.navigateByUrl('/pages/login');
          this.requestOk = false;
          console.log(err);
        });
    }

    else this.requestOk = false;

  }




}
