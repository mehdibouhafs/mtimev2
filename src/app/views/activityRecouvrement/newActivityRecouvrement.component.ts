import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthenticationService} from "../../services/authentification.service";
import {NotificationsService} from "angular2-notifications";
import {SocketService} from "../../services/socket.service";
import {Client, Frame, Message} from "stompjs";
import {ActivityRecouvrement} from "../../model/model.activityRecouvrement";
import {ActivityService} from "../../services/activity.service";
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../model/model.customer";
import {Router} from "@angular/router";
import {ProjectService} from "../../services/project.service";
import {DateTimeAdapter} from "ng-pick-datetime";
import * as moment from "moment-timezone";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {VilleService} from "../../services/ville.service";

@Component({
  selector:"new-activityRecouvrement",
  templateUrl: 'newActivityRecouvrement.component.html',
})
export class NewActivityRecouvrementComponent implements OnInit,OnDestroy {

  @Input() modal;
  @Input() lastActivity;

  @Output() refresh = new EventEmitter<string>();

  customers : any = [];
  ville:any;


  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  @Input() activityRecouvrement : ActivityRecouvrement = new ActivityRecouvrement();
  frmName:any;
  mode:number=1;
  message : string;
  currentDate : Date = new Date();
  disabledStatut:boolean = false;
  dureeFormated : string;
  error:number = 0;
  returnedError : string;

  duree: number;
  dureeConverted: string;

  customerTypeahead = new EventEmitter<string>();

  constructor(private villeService:VilleService, private activityService:ActivityService,private notificationService: NotificationsService,
              private socketService:SocketService,private customerService:CustomerService,private router:Router,
              private authenticationService:AuthenticationService,private projectService:ProjectService, private ref:ChangeDetectorRef) {
  }

  refreshActivity() {
    this.refresh.emit("Refresh Activity");
  }


  hideModal() {
    this.modal.hide();
  }

  toModeDupliquer() {
    this.duree = null;
    this.dureeConverted = null;
    this.mode = 1;
    this.activityRecouvrement.id = null;
  }

  toModeOne() {
    this.activityRecouvrement = new ActivityRecouvrement();
    this.activityRecouvrement.user.username = this.authenticationService.getUserName();
    this.mode = 1;
    this.error = 0;
    this.activityRecouvrement.dteStrt = new Date();
    this.activityRecouvrement.ville = "Fes";
    this.activityRecouvrement.statut = true;
    this.activityRecouvrement.lieu = "Client";
    this.activityRecouvrement.typeActivite = "Activité recouvrement";
    this.activityRecouvrement.comments = "Teste";
    this.duree = null;
    this.dureeConverted = null;
  }

  ngOnDestroy(){

  }

  onTestSocket(){

  }

  ngOnInit() {
    this.activityRecouvrement.user.username = this.authenticationService.getUserName();
    this.activityRecouvrement.dteStrt = new Date();
    this.activityRecouvrement.statut = false;
    this.activityRecouvrement.ville = "Fes";
    this.activityRecouvrement.statut = true;
    this.activityRecouvrement.lieu = "Client";
    this.activityRecouvrement.typeActivite = "Activité recouvrement";
    this.activityRecouvrement.comments = "Teste";
    this.serverSideSearch();
    this.chargerVilles();
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



  onDatesChanged(){
    console.log("onDatesChanged ");
    if(this.activityRecouvrement.dteStrt != null && this.activityRecouvrement.dteEnd !=null){
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activityRecouvrement.dteStrt, this.activityRecouvrement.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activityRecouvrement.dteStrt,this.activityRecouvrement.dteEnd) == true ){

        this.activityRecouvrement.statut = true;
      }else{
        this.activityRecouvrement.statut = false;

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

  onSaveActivityRecouvrement(){

    this.activityRecouvrement.createdAt = new Date();
    this.activityRecouvrement.updatedAt = new Date();

    this.dureeFormated = this.activityService.diffBetwenTwoDateFormated(this.activityRecouvrement.dteStrt,this.activityRecouvrement.dteEnd);
    console.log("Activity Project " +JSON.stringify(this.activityRecouvrement));
    console.log("diffBetwenTwoDateInMinutes " + this.activityService.diffBetwenTwoDateInMinutes(this.activityRecouvrement.dteStrt,this.activityRecouvrement.dteEnd));
    //this.activityRecouvrement.dteStrt = new Date(this.activityService.formatDate(this.activityRecouvrement.dteStrt));
    //this.activityRecouvrement.dteEnd = new Date(this.activityService.formatDate(this.activityRecouvrement.dteEnd));
    console.log("Date SAved "+this.activityRecouvrement.dteStrt);
    this.activityRecouvrement.hrStrt = moment(this.activityRecouvrement.dteStrt).format("HH:mm");
    this.activityRecouvrement.hrEnd =  moment(this.activityRecouvrement.dteEnd).format("HH:mm");
    this.activityRecouvrement.durtion =  this.activityService.diffBetwenTwoDateInMinutes(this.activityRecouvrement.dteStrt,this.activityRecouvrement.dteEnd);
    console.log("duration " +  this.activityRecouvrement.durtion );
    this.activityService.saveActivity(this.activityRecouvrement)
      .subscribe((data:ActivityRecouvrement)=>{
        console.log("ok resp " + JSON.stringify(data));
        this.activityRecouvrement = data;
        this.activityRecouvrement.typeActivite = "Activité recouvrement";
        this.mode=2;
        this.refreshActivity();
        this.ref.detectChanges();

      },(err:any)=>{
        console.log("error " + JSON.stringify(err));
        this.returnedError = err.error.message;
        this.error = 1;
      });
  }


}
