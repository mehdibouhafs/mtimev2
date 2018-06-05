import {ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivityProject} from "../../model/model.activityProject";
import {ActivityService} from "../../services/activity.service";
import * as moment from "moment-timezone";
import {NotificationsService} from "angular2-notifications";
import {Subject} from "rxjs/Subject";
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../model/model.customer";
import {ProjectService} from "../../services/project.service";
import {DateTimeAdapter} from "ng-pick-datetime";
import {Project} from "../../model/model.project";

@Component({
  selector: 'edit-activity-project',
  templateUrl: 'editActivityProject.component.html'
})
export class EditActivityProjectComponent implements OnInit {

  mode: number = 1;
  message: string;
  customers: any;
  projects: any;
  currentDate: Date = new Date();
  dureeFormated: string;
  error: number = 0;
  returnedError: string;
  @Input() activityProject: ActivityProject = new ActivityProject();
  @Input() modal;
  @Input() pageActivities: any;
  @Input() index:any;
  @Input() toDo:boolean = false;
  @Input() disabledStatut:boolean = false;

  duree: number;
  dureeConverted: string;

  constructor(private activityService: ActivityService, private notificationService: NotificationsService, private customerService: CustomerService, private router: Router,
              private authenticationService: AuthenticationService, private projectService: ProjectService, private ref:ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loadCustomers();
    this.teste();
  }

  onEditActivityProject() {
    this.activityProject.updatedAt = new Date();
    this.activityProject.hrStrt = moment(this.activityProject.dteStrt).format("HH:mm");
    this.activityProject.hrEnd =  moment(this.activityProject.dteEnd).format("HH:mm");
    this.activityProject.durtion =  this.activityService.diffBetwenTwoDateInMinutes(this.activityProject.dteStrt,this.activityProject.dteEnd);
    this.activityService.updateActivity(this.activityProject)
      .subscribe((data: ActivityProject) => {
        this.pageActivities.content.splice(this.index, 1, this.activityProject);
        this.mode = 2;
        this.ref.detectChanges();
      }), err => {
      console.log(JSON.parse(err.body).message);
    };
  }


  hideModal() {
    this.modal.hide();
  }

  teste() {
    this.projects = [];
    this.activityProject.project = new Project();
    if (this.activityProject.customer.code!=null) {
      this.projectService.getProjectsByCustomer(this.activityProject.customer.code).subscribe(
        data => {
          this.projects = data;
          console.log("dev");
          console.log(data);
          //console.log("projects customer " + JSON.stringify(this.projects));
        }, err => {
          this.authenticationService.logout();
          this.router.navigateByUrl('/pages/login');

        });
    }
  }

  onDatesChanged(){
    console.log("onDatesChanged ");
    if(this.activityProject.dteStrt != null && this.activityProject.dteEnd !=null){
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activityProject.dteStrt, this.activityProject.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activityProject.dteStrt,this.activityProject.dteEnd) == true ){

        this.activityProject.statut = true;
        this.disabledStatut = false;

      }else{
        this.activityProject.statut = false;
        this.disabledStatut = true;

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

}
