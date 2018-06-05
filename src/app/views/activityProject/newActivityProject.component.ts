import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
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
import {Project} from "../../model/model.project";

@Component({
  selector:"new-activtyProject",
  templateUrl: 'newActivityProject.component.html',
})
export class NewActivityProjectComponent implements OnInit,OnDestroy {

  @Input() modal;
  @Input() lastActivity;

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  activityProject : ActivityProject = new ActivityProject();
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

  duree: number;
  dureeConverted: string;


  //activityProject.dteStrt = new Date(); //new Date(2010, 11, 28, 14, 57);
  //activityProject.dteEnd = new Date(); //new Date(2010, 11, 28, 14, 57);

  constructor(private activityService:ActivityService,private notificationService: NotificationsService,
              private socketService:SocketService,private customerService:CustomerService,private router:Router,
              private authenticationService:AuthenticationService,private projectService:ProjectService, private ref:ChangeDetectorRef) {
  }

  hideModal() {
    this.modal.hide();
  }

  toModeDupliquer() {
    this.mode = 1;
    this.activityProject.id = null;
    this.activityProject.dteStrt = new Date();
    this.duree = null;
    this.dureeConverted = null;
  }

  toModeOne() {

    this.loadCustomers();
    this.mode = 1;
    this.error = 0;
    this.activityProject = new ActivityProject();
    this.activityProject.user.username = this.authenticationService.getUserName();
    this.activityProject.dteStrt = new Date();
    this.activityProject.ville = "Fes";
    this.activityProject.statut = true;
    this.activityProject.nature = "Projet";
    this.activityProject.lieu = "Client";
    this.activityProject.typeActivite = "Activité projet";
    this.activityProject.comments = "Teste";
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
    this.projects = [];
    this.activityProject.project = new Project();
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
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activityProject.dteStrt, this.activityProject.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activityProject.dteStrt,this.activityProject.dteEnd) == true ){

        this.activityProject.statut = true;

      }else{
        this.activityProject.statut = false;
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
    this.activityProject.createdAt = new Date();
    this.activityProject.updatedAt = new Date();
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
        .subscribe((data:ActivityProject )=>{
        console.log("ok resp " + JSON.stringify(data));
          this.activityProject = data;
          this.activityProject.typeActivite = "Activité projet";
          this.mode=2;
          this.ref.detectChanges();
        },(err:any)=>{
         console.log("error " + JSON.stringify(err));
         this.returnedError = err.error.message;
         this.error = 2;

      });
  }








}
