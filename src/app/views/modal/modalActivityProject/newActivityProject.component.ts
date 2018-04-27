import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
import {ProjectService} from "../../../services/project.service";
import {ActivityProject} from "../../../model/model.activityProject";

@Component({
  selector:"new-activtyProject-modal",
  templateUrl: 'newActivityProject.component.html',
})
export class NewActivityProjectComponent implements OnInit,OnDestroy {

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  @Input()  activityProject : ActivityProject = new ActivityProject();
  frmName:any;
  mode:number=1;
  message : string;
  customers : any;
  projects : any;
  currentDate : Date = new Date();
  disabledStatut:boolean = false;
  dureeFormated : string;
  error:number = 0;
  returnedError : string;


  //activityProject.dteStrt = new Date(); //new Date(2010, 11, 28, 14, 57);
  //activityProject.dteEnd = new Date(); //new Date(2010, 11, 28, 14, 57);

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
    this.activityProject.user.username = this.authenticationService.getUserName();
    this.activityProject.dteStrt = new Date();
    this.activityProject.statut = false;
    this.activityProject.ville = "Fes";
    this.activityProject.statut = true;
    this.activityProject.nature = "Projet";
    this.activityProject.lieu = "Client";
    this.activityProject.typeActivite = "Activité projet";
    this.activityProject.comments = "Teste";
  }

  teste(){
    console.log("dev2");
    this.activityProject.project.prjId = null;
    this.projectService.getProjectsByCustomer(this.activityProject.customer.code).subscribe(
      data=>{
        this.projects = data;
        //console.log("projects customer " + JSON.stringify(this.projects));
      },err=>{
        this.authenticationService.logout();
        this.router.navigateByUrl('/pages/login');

      });
  }

  onDatesChanged(){
    console.log("onDatesChanged ");
    if(this.activityProject.dteStrt != null && this.activityProject.dteEnd !=null){
      if (this.activityService.testDateBeforeNow(this.activityProject.dteStrt,this.activityProject.dteEnd) == true ){

        this.error = 0;

      }else{
        console.log("esle");
        this.activityProject.statut = false;
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

  onSaveActivityProject(){
    console.log(" project " + JSON.stringify(this.activityProject.project));
    this.dureeFormated = this.activityService.diffBetwenTwoDateFormated(this.activityProject.dteStrt,this.activityProject.dteEnd);
    console.log("Activity Project " +JSON.stringify(this.activityProject));
    console.log("diffBetwenTwoDateInMinutes " + this.activityService.diffBetwenTwoDateInMinutes(this.activityProject.dteStrt,this.activityProject.dteEnd));
    //this.activityProject.dteStrt = new Date(this.activityService.formatDate(this.activityProject.dteStrt));
    //this.activityProject.dteEnd = new Date(this.activityService.formatDate(this.activityProject.dteEnd));
    console.log("Date SAved "+this.activityProject.dteStrt);
    this.activityProject.hrStrt = moment(this.activityProject.dteStrt).format("HH:mm");
    this.activityProject.hrEnd =  moment(this.activityProject.dteEnd).format("HH:mm");
    this.activityProject.durtion =  this.activityService.diffBetwenTwoDateInMinutes(this.activityProject.dteStrt,this.activityProject.dteEnd);
    console.log("duration " +  this.activityProject.durtion );
    this.activityService.saveActivity(this.activityProject)
        .subscribe((data )=>{
        console.log("ok resp " + JSON.stringify(data));
          //this.activityProject = data;
          this.mode=2;
         /* const toast= this.notificationService.success("Confirmation d'ajout", "ActivyProject ajouté avec succès", {
            timeOut: 7000,
            showProgressBar: false,
            pauseOnHover: true,
            clickToClose: false,
            clickIconToClose: true});
          //this.appHeaderComponent = new AppHeaderComponent(null,null,this.notificationService);
          //this.appHeaderComponent.lunchSuccessFunction(this.notificationService);*/

          /*toast.clickIcon.subscribe((event) => {
            console.log("test");
          });*/
        },(err:any)=>{
         console.log("error " + JSON.stringify(err));
         this.returnedError = err.error.message;
         this.error = 2;

      });
  }








}
