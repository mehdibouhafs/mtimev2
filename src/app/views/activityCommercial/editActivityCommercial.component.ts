import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ActivityService} from "../../services/activity.service";
import {CustomerService} from "../../services/customer.service";
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router";
import {ActivityCommercial} from "../../model/model.activityCommercial";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {VilleService} from "../../services/ville.service";
import {NatureService} from "../../services/nature.service";
import * as moment from "moment";

@Component({
  selector: 'edit-activity-commercial',
  templateUrl: 'editActivityCommercial.component.html'
})

export class EditActivityCommercialComponent implements OnInit {

  @Output() refresh = new EventEmitter<string>();


  @Input() modal;
  @Input() activityCommercial;
  @Input() toDo: boolean = false;
  @Input() disabledStatut = false;
  @Input() customers: any;
  message: string;
  projects: any;
  currentDate: Date = new Date();
  dureeFormated: string;
  error: number = 0;
  mode: number = 1;
  returnedError: string;

  duree: number;
  @Input() dureeConverted: string;
  ville:any;
  natures:any;

  customerTypeahead = new EventEmitter<string>();

  constructor(private natureService:NatureService, private villeService:VilleService, private activityService: ActivityService, private customerService: CustomerService, private router: Router, private authenticationService: AuthenticationService, private ref: ChangeDetectorRef) {

  }

  ngOnInit() {
    if(!this.authenticationService.isLogged())
      this.router.navigateByUrl('/pages/login');
    else {
      this.serverSideSearch();
      this.chargerVilles();
      this.chargerNatures();
    }
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

  hideModal() {
    this.modal.hide();
    this.error = 0;
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

  refreshActivity() {
    this.refresh.emit("Refresh Activity");
  }

  onEditActivityCommercial() {
    this.activityCommercial.updatedAt = new Date();
    this.activityCommercial.hrStrt = moment(this.activityCommercial.dteStrt).format("HH:mm");
    this.activityCommercial.hrEnd = moment(this.activityCommercial.dteEnd).format("HH:mm");
    this.activityCommercial.durtion = this.activityService.diffBetwenTwoDateInMinutes(this.activityCommercial.dteStrt, this.activityCommercial.dteEnd);
    this.activityService.updateActivity(this.activityCommercial)
      .subscribe((data: ActivityCommercial) => {
        this.mode = 2;
        this.refreshActivity();
        this.ref.detectChanges();
      }, err => {
        this.returnedError = err.error.message;
        this.error = 1;
        console.log(JSON.parse(err.body).message);
      });
  }
}
