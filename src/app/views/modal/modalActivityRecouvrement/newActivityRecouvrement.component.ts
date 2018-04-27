import {Component, OnDestroy, OnInit} from '@angular/core';

import {NotificationsService} from "angular2-notifications";

import {Client, Frame, Message} from "stompjs";
import {Subject} from "rxjs/Subject";

import {Router} from "@angular/router";
import {DateTimeAdapter} from "ng-pick-datetime";
import * as moment from "moment-timezone";
import {ActivityService} from "../../../services/activity.service";
import {SocketService} from "../../../services/socket.service";
import {CustomerService} from "../../../services/customer.service";
import {AuthenticationService} from "../../../services/authentification.service";
import {ActivityRecouvrement} from "../../../model/model.activityRecouvrement";
import {ProjectService} from "../../../services/project.service";

@Component({
  selector:"app-new-activtyRecouvrement",
  templateUrl: 'newActivityRecouvrement.component.html',
})
export class NewActivityRecouvrementComponent implements OnInit,OnDestroy {

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  activityRecouvrement : ActivityRecouvrement = new ActivityRecouvrement();
  frmName:any;
  mode:number=1;
  message : string;
  customers : any;
  currentDate : Date = new Date();
  disabledStatut:boolean = false;
  dureeFormated : string;
  error:number = 0;
  returnedError : string;


  //activityRecouvrement.dteStrt = new Date(); //new Date(2010, 11, 28, 14, 57);
  //activityRecouvrement.dteEnd = new Date(); //new Date(2010, 11, 28, 14, 57);

  constructor(private activityService:ActivityService,private notificationService: NotificationsService,
              private socketService:SocketService,private customerService:CustomerService,private router:Router,
              private authenticationService:AuthenticationService,private projectService:ProjectService) {
  }

  ngOnDestroy(){

  }

  onTestSocket(){

  }

  ngOnInit() {
    this.loadCustomers();
    this.activityRecouvrement.user.username = this.authenticationService.getUserName();
    this.activityRecouvrement.dteStrt = new Date();
    this.activityRecouvrement.statut = false;
    this.activityRecouvrement.ville = "Fes";
    this.activityRecouvrement.statut = true;
    this.activityRecouvrement.nature = "Projet";
    this.activityRecouvrement.lieu = "Client";
    this.activityRecouvrement.typeActivite = "Activité recouvrement";
    this.activityRecouvrement.comments = "Teste";
  }



  onDatesChanged(){
    console.log("onDatesChanged ");
    if(this.activityRecouvrement.dteStrt != null && this.activityRecouvrement.dteEnd !=null){
      if (this.activityService.testDateBeforeNow(this.activityRecouvrement.dteStrt,this.activityRecouvrement.dteEnd) == true ){

        this.error = 0;

      }else{
        console.log("esle");
        this.activityRecouvrement.statut = false;
        this.disabledStatut = true;
        this.error = 1;

      }
    }
  }



  loadCustomers(){
    this.customerService.getCustomers().subscribe(
      data=>{
        this.customers = data["_embedded"]["customers"];
        console.log("customers " + JSON.stringify(this.customers));
      },err=>{
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

  onSaveActivityRecouvrement(){

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
      .subscribe((data )=>{
        console.log("ok resp " + JSON.stringify(data));
        //this.activityRecouvrement = data;
        this.mode=2;

      },(err:any)=>{
        console.log("error " + JSON.stringify(err));
        this.returnedError = err.error.message;
        this.error = 2;

      });
  }








}
