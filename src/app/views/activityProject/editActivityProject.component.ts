import {Component, OnInit} from "@angular/core";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivityProject} from "../../model/model.activityProject";
import {ActivityService} from "../../services/activity.service";

@Component({
  templateUrl: 'editActivityProject.component.html'
})
export class EditActivityProjectComponent implements OnInit{
  mode:number=1;
  activityProject : ActivityProject = new ActivityProject();
  idActivityProject :number;

  constructor(private activityService:ActivityService,private  autehntificationService:AuthenticationService,private activateRoute:ActivatedRoute){

    this.idActivityProject = this.activateRoute.snapshot.params['id'];

  }

  ngOnInit(){
      this.activityService.getActivity(this.idActivityProject)
        .subscribe((data:ActivityProject)=>{
          this.activityProject = data;
          console.log("activityProject " + this.activityProject);
        },err=>{
          console.log(err);
        });
  }

  onEditActivityProject() {
    this.activityService.updateActivity(this.activityProject)
      .subscribe((data: ActivityProject) => {
        console.log("ok " + data);
        this.activityProject = data;
        this.mode = 2;
      }), err => {
      console.log(JSON.parse(err.body).message);
    };
  }


}
