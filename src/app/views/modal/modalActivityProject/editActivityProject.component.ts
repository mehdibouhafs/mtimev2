import {ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from "moment-timezone";
import {ActivityService} from "../../../services/activity.service";
import {AuthenticationService} from "../../../services/authentification.service";
import {ActivityProject} from "../../../model/model.activityProject";
import {CustomerService} from "../../../services/customer.service";
import {ProjectService} from "../../../services/project.service";
@Component({
  selector: 'edit-activityProject-modal',
  templateUrl: 'editActivityProject.component.html'
})
export class EditActivityProjectComponent implements OnInit{
  mode:number=1;
  @Input() activityProject : ActivityProject;
  idActivityProject :number;
  @Input() modal;
  customers : any;
  projects : any;
  error:number = 0;
  disabledStatut:boolean = false;
  constructor(private activityService:ActivityService,private authentificationService:AuthenticationService,private activateRoute:ActivatedRoute,private customerService : CustomerService,private projectService:ProjectService,private ref:ChangeDetectorRef){
  }

  hideModal() {
    this.disabledStatut= false;
    this.error = 0;
    this.mode = 1;
    this.modal.hide();
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

  ngOnInit(){
    this.activityProject =  new ActivityProject();
    if(this.customers==null) this.loadCustomers();

  }

  onEditActivityProject() {



    this.activityProject.typeActivite = "Activité projet";
    this.activityService.updateActivity(this.activityProject)
      .subscribe((data:any) => {

        this.mode = 2;
        this.activityProject = data;
        this.activityProject.dteStrt = new Date(this.activityProject.dteStrt);
        this.activityProject.dteEnd = new Date(this.activityProject.dteEnd);
        this.ref.detectChanges();
      }, err => {
      console.log(JSON.parse(err.body).message);
    });

    console.log("this.mode out " + this.mode);




  }

  loadCustomers(){
    this.customerService.getCustomers().subscribe(
      data=>{
        this.customers = data["_embedded"]["customers"];
        console.log("customers " + JSON.stringify(this.customers));
      },err=>{
        //this.authenticationService.logout();
        //this.router.navigateByUrl('/pages/login');
      });
  }

  teste(){
    console.log("dev2");
    this.activityProject.project.prjId = null;
    this.projectService.getProjectsByCustomer(this.activityProject.customer.code).subscribe(
      data=>{
        this.projects = data;
        //console.log("projects customer " + JSON.stringify(this.projects));
      },err=>{
        //this.authenticationService.logout();
       // this.router.navigateByUrl('/pages/login');

      });
  }


}
