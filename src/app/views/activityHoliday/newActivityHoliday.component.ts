import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ActivityService} from "../../services/activity.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivityHoliday} from "../../model/model.activityHoliday";
import {Customer} from "../../model/model.customer";

@Component({
  selector: 'new-activityHoliday',
  templateUrl: 'newActivityHoliday.component.html'
})

export class NewActivityHolidayComponent implements OnInit {

  @Input() modal;
  @Input() lastActivity;

  @Output() refresh = new EventEmitter<string>();

  @Input() activityHoliday: ActivityHoliday = new ActivityHoliday();
  error: number = 0;
  mode = 1;
  returnedError : string;
  currentDate : Date = new Date();
  disabledStatut:boolean = false;
  dureeFormated : string;

  duree: number;
  dureeConverted: string;

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

  constructor(private activityService: ActivityService, private router: Router, private authentificationService: AuthenticationService, private ref:ChangeDetectorRef) {
    console.log("Constructor holiday");
  }

  refreshActivity() {
    this.refresh.emit("Refresh Activity");
  }

  hideModal() {
    console.log("to hide Modal");
    this.modal.hide();
  }

  toModeDupliquer() {
    this.mode = 1;
    this.activityHoliday.id = null;
    this.dureeConverted = null;
    this.duree = null;
  }

  toModeOne() {
    console.log("to mode One");
    this.mode = 1;
    this.error = 0;
    this.activityHoliday = new ActivityHoliday();
    this.activityHoliday.user.username = this.authentificationService.getUserName();
    this.activityHoliday.dteStrt = null;
    this.activityHoliday.dteEnd = null;
    this.activityHoliday.statut = true;
    this.activityHoliday.nature = "Conge";
    this.activityHoliday.typeActivite = "Activité congé";
    this.dureeConverted = null;
    this.duree = null;
  }

  ngOnInit() {
    console.log("this.activityHoliday.date "+ this.activityHoliday.dteStrt);
    this.activityHoliday.user.username = this.authentificationService.getUserName();
    this.activityHoliday.statut = true;
    this.activityHoliday.nature = "Conge";

    this.activityHoliday.typeActivite = "Activité congé";
  }

  onDatesChanged(){

  }

  onSaveActivityHoliday() {

    this.activityHoliday.createdAt = new Date();
    this.activityHoliday.updatedAt = new Date();
    this.activityHoliday.customer = new Customer()
    this.activityHoliday.customer.code="C10989";
    this.activityHoliday.hrStrt = "00:00";
    this.activityHoliday.hrEnd = "23:59";
    this.activityHoliday.durtion = this.activityService.diffBetwenTwoDateInMinutes(this.activityHoliday.dteStrt, this.activityHoliday.dteEnd);
    this.activityService.saveActivity(this.activityHoliday)
      .subscribe((data: ActivityHoliday) => {
        this.activityHoliday = data;
        this.mode = 2;
        this.refreshActivity();
        this.ref.detectChanges();
        this.activityHoliday.typeActivite = "Activité congé";
        this.activityHoliday.user.username = this.authentificationService.getUserName();
      }, (err: any) => {
        console.log("error " + JSON.stringify(err));
        this.returnedError = err.error.message;
        this.error = 2;

      });
  }


}
