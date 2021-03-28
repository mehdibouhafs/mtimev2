import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivityRecouvrement} from "../../model/model.activityRecouvrement";
import {ActivityService} from "../../services/activity.service";
import * as moment from "moment-timezone";
import {CustomerService} from "../../services/customer.service";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {VilleService} from "../../services/ville.service";

@Component({
  selector: 'edit-activity-recouvrement',
  templateUrl: 'editActivityRecouvrement.component.html'
})
export class EditActivityRecouvrementComponent implements OnInit {

  @Output() refresh = new EventEmitter<string>();

  mode: number = 1;
  @Input() modal;
  @Input() activityRecouvrement: ActivityRecouvrement = new ActivityRecouvrement();
  @Input() customers: any;
  @Input() toDo: boolean = false;
  @Input() disabledStatut: boolean = false;

  message: string;
  currentDate: Date = new Date();
  dureeFormated: string;
  error: number = 0;
  returnedError: string;
  ville:any;

  duree: number;
  @Input() dureeConverted: string;

  customerTypeahead = new EventEmitter<string>();

  constructor(private villeService:VilleService, private activityService: ActivityService, private customerService: CustomerService, private authenticationService: AuthenticationService, private router: Router, private activateRoute: ActivatedRoute, private ref: ChangeDetectorRef) {

  }

  ngOnInit() {
    if(!this.authenticationService.isLogged())
      this.router.navigateByUrl('/pages/login');
    else {
      this.serverSideSearch();
      this.chargerVilles();
    }
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

  refreshActivity() {
    this.refresh.emit("Rafresh Activity");
  }

  onEditActivityRecouvrement() {
    this.activityRecouvrement.updatedAt = new Date();
    this.activityRecouvrement.hrStrt = moment(this.activityRecouvrement.dteStrt).format("HH:mm");
    this.activityRecouvrement.hrEnd = moment(this.activityRecouvrement.dteEnd).format("HH:mm");
    this.activityRecouvrement.durtion = this.activityService.diffBetwenTwoDateInMinutes(this.activityRecouvrement.dteStrt, this.activityRecouvrement.dteEnd);
    this.activityService.updateActivity(this.activityRecouvrement)
      .subscribe((data: ActivityRecouvrement) => {
        this.refreshActivity();
        this.mode = 2;
        this.ref.detectChanges();
      }, err => {
        console.log(JSON.stringify(err));
        this.returnedError = err.error.message;
        this.error=1;
      });
  }

  onDatesChanged() {
    console.log("onDatesChanged ");
    if (this.activityRecouvrement.dteStrt != null && this.activityRecouvrement.dteEnd != null) {
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activityRecouvrement.dteStrt, this.activityRecouvrement.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activityRecouvrement.dteStrt, this.activityRecouvrement.dteEnd) == true) {

        this.activityRecouvrement.statut = true;
        this.disabledStatut = false;

      } else {
        this.activityRecouvrement.statut = false;
        this.disabledStatut = true;

      }
    }
  }

}
