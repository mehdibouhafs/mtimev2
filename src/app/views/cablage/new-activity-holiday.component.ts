import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ActivityService} from "../../services/activity.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivityHoliday} from "../../model/model.activityHoliday";
import {Customer} from "../../model/model.customer";
import {UserService} from "../../services/user.service";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";

@Component({
  selector: 'new-activity-holiday',
  templateUrl: 'new-activity-holiday.component.html'
})

export class NewActivityHolidayCablageComponent implements OnInit {

  @Input() modal;
  @Input() lastActivity;

  @Output() refresh = new EventEmitter<string>();

  activityHoliday: ActivityHoliday = new ActivityHoliday();
  error: number = 0;
  mode = 1;
  returnedError : string;
  currentDate : Date = new Date();
  disabledStatut:boolean = false;
  dureeFormated : string;

  duree: number;
  dureeConverted: string;

  usersTypeahead = new EventEmitter<string>();
  users: any;

  constructor(private userService:UserService, private activityService: ActivityService, private router: Router, private authentificationService: AuthenticationService, private ref:ChangeDetectorRef) {

  }

  refreshActivity() {
    this.refresh.emit("Refresh Activity");
  }

  hideModal() {
    this.modal.hide();
  }

  toModeDupliquer() {
    this.mode = 1;
    this.activityHoliday.id = null;
    this.dureeConverted = null;
    this.duree = null;
  }

  toModeOne() {
    this.mode = 1;
    this.error = 0;
    this.activityHoliday = new ActivityHoliday();
    this.activityHoliday.statut = true;
    this.activityHoliday.nature = "Conge";
    this.activityHoliday.typeActivite = "Activité congé";
    this.activityHoliday.user = null;
    this.dureeConverted = null;
    this.duree = null;

  }

  ngOnInit() {
    this.activityHoliday.statut = true;
    this.activityHoliday.nature = "Conge";
    this.activityHoliday.dteStrt = new Date();
    this.activityHoliday.typeActivite = "Activité congé";
    this.activityHoliday.user = null;
    this.serverSideSearch();
  }

  private serverSideSearch() {

    this.usersTypeahead.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      switchMap(term => this.userService.searchUsersByService(term))
    ).subscribe(x => {
      this.ref.markForCheck();
      this.users = x["content"];
    }, (err) => {
      console.log(err);
      this.users = [];
    });

  }

  onDatesChanged(){
    if(this.activityHoliday.dteStrt != null && this.activityHoliday.dteEnd !=null){
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activityHoliday.dteStrt, this.activityHoliday.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activityHoliday.dteStrt,this.activityHoliday.dteEnd) == true ){

        this.activityHoliday.statut = true;

      }else{
        this.activityHoliday.statut = false;

      }
    }
  }

  onSaveActivityHoliday() {

    this.activityHoliday.createdAt = new Date();
    this.activityHoliday.updatedAt = new Date();
    this.activityHoliday.customer = new Customer()
    this.activityHoliday.customer.code="05959";
    this.activityHoliday.hrStrt = "00:00";
    this.activityHoliday.hrEnd = "23:59";
    this.activityHoliday.durtion = this.activityService.diffBetwenTwoDateInMinutes(this.activityHoliday.dteStrt, this.activityHoliday.dteEnd);
    this.activityService.saveActivity(this.activityHoliday)
      .subscribe((data: ActivityHoliday) => {
        console.log("ok resp " + JSON.stringify(data));
        this.activityHoliday = data;
        this.mode = 2;
        this.refreshActivity();
        this.ref.detectChanges();
        this.activityHoliday.typeActivite = "Activité congé";
      }, (err: any) => {
        console.log("error " + JSON.stringify(err));
        this.returnedError = err.error.message;
        this.error = 2;

      });
  }


}
