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
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {VilleService} from "../../services/ville.service";
import {NatureService} from "../../services/nature.service";

@Component({
  selector: "new-activtyCommercial",
  templateUrl: 'newActivityCommercial.component.html',
})
export class NewActivityCommercialComponent implements OnInit, OnDestroy {

  @Input() modal;
  @Input() lastActivity;
  @Input() customers: any;


  @Output() refresh = new EventEmitter<string>();

  ville:any;
  natures:any;

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  @Input() activityCommercial: ActivityCommercial = new ActivityCommercial();
  frmName: any;
  mode: number = 1;
  message: string;
  projects: any;
  currentDate: Date = new Date();
  disabledStatut: boolean = false;
  dureeFormated: string;
  error: number = 0;
  returnedError: string;

  duree: number;
  dureeConverted: string;

  customerTypeahead = new EventEmitter<string>();


  constructor(private natureService:NatureService, private villeService:VilleService, private activityService: ActivityService, private notificationService: NotificationsService,
              private socketService: SocketService, private customerService: CustomerService, private router: Router,
              private authenticationService: AuthenticationService, private projectService: ProjectService, private ref:ChangeDetectorRef) {
  }

  refreshActivity() {
    this.refresh.emit("Refresh Activity");
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
    this.activityCommercial = new ActivityCommercial();
    this.activityCommercial.user.username = this.authenticationService.getUserName();
    this.activityCommercial.dteStrt = new Date();
    this.activityCommercial.statut = true;
    this.activityCommercial.typeActivite = "Activité commerciale";
    this.duree = null;
    this.dureeConverted = null;
  }

  ngOnDestroy() {

  }

  onTestSocket() {

  }

  ngOnInit() {
    this.activityCommercial.user.username = this.authenticationService.getUserName();
    this.activityCommercial.dteStrt = new Date();
    this.activityCommercial.statut = true;
    this.activityCommercial.typeActivite = "Activité commerciale";
    this.serverSideSearch();
    this.chargerVilles();
    this.chargerNatures();
  }

  private serverSideSearch() {
    this.customerTypeahead.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      switchMap(term => this.customerService.searchCustomer(term))
    ).subscribe(x => {
      this.ref.markForCheck();
      this.customers = x["_embedded"]["customers"];
    }, (err) => {
      console.log(err);
      this.customers = [];
    });
  }

  chargerNatures() {
    this.natureService.getNatureParType("Activity_commerciale").subscribe(
      data=>{
        this.natures = data["_embedded"]["nature"];
      }, err=>{
        console.log(err);
      }
    );
  }

  chargerVilles() {
    this.villeService.getAllVilles().subscribe(
      data=>{
        this.ville=data["_embedded"]["villes"];
      }
    );
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
        this.refreshActivity();
        this.ref.detectChanges();
      }, (err: any) => {
        console.log("error " + JSON.stringify(err));
        this.returnedError = err.error.message;
        this.error = 1;

      });


  }


}
