import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";


import * as moment from "moment-timezone";
import {ActivityService} from "../../../services/activity.service";
import {AuthenticationService} from "../../../services/authentification.service";
import {ActivityProject} from "../../../model/model.activityProject";
@Component({
  templateUrl: 'showActivityProject.component.html'
})
export class ShowActivityProjectComponent implements OnInit{
  activityProject : ActivityProject = new ActivityProject();
  idActivityProject :number;

  constructor(private activityService:ActivityService,private  autehntificationService:AuthenticationService,private activateRoute:ActivatedRoute,private router:Router){
    this.idActivityProject = this.activateRoute.snapshot.params['id'];
  }

  ngOnInit(){
      this.activityService.getActivity(this.idActivityProject)
        .subscribe((data:ActivityProject)=>{
          this.activityProject = data;
          this.activityProject.dteStrt = new Date(this.activityProject.dteStrt);
          this.activityProject.dteEnd = new Date(this.activityProject.dteEnd);
          console.log("activityProject " + JSON.stringify(this.activityProject));
        },err=>{
          console.log(err);
        });
  }

  onShowAllMyActivities(){
    this.router.navigate(["/activityProject/my-activities/"]);
  }




}
