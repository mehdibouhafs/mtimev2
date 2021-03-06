import {Component, OnDestroy, OnInit} from '@angular/core';
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

@Component({
  selector:"app-new-activtyProject",
  templateUrl: 'newActivityProject.component.html',
})
export class NewActivityProjectComponent implements OnInit,OnDestroy {

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  activityProject : ActivityProject = new ActivityProject();
  frmName:any;
  mode:number=1;
  //appHeaderComponent: AppHeaderComponent;
  message : string;

  customers : any;
  projects : any;
  idclient : any;

  public selectedMoment = new Date();

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

  ngOnInit(){
    this.loadCustomers();
    this.activityProject.user.username = this.authenticationService.getUserName();
    //this.activityProject.dteEnd = new Date();
    this.activityProject.dteStrt = new Date();
    console.log("date init " +this.activityProject.dteStrt);
    this.activityProject.statut = true;
    this.activityProject.ville="Fes";
    this.activityProject.statut=true;
    this.activityProject.nature = "Projet";
    this.activityProject.lieu ="Client";
    this.activityProject.typeActivite = "Activité projet";
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

    console.log("Activity Project " +JSON.stringify(this.activityProject));
    console.log("diff " + this.activityService.diffBetwenTwoDate(this.activityProject.dteStrt,this.activityProject.dteEnd));
    //this.activityProject.dteStrt = new Date(this.activityService.formatDate(this.activityProject.dteStrt));
    //this.activityProject.dteEnd = new Date(this.activityService.formatDate(this.activityProject.dteEnd));
    console.log("Date SAved "+this.activityProject.dteStrt);
      this.activityService.saveActivity(this.activityProject)
        .subscribe((data :ActivityProject)=>{
          this.activityProject = data;
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
        }),err=>{
        console.log(JSON.parse(err.body).message);
      }
  }








}
