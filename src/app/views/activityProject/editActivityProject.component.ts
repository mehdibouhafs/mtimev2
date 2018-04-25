import {Component, Input, OnInit} from "@angular/core";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivityProject} from "../../model/model.activityProject";
import {ActivityService} from "../../services/activity.service";
import * as moment from "moment-timezone";
@Component({
  selector: 'edit-activityProject-modal',
  templateUrl: 'editActivityProject.component.html'
})
export class EditActivityProjectComponent implements OnInit{
  mode:number=1;
  @Input()
  activityProject : ActivityProject;
  idActivityProject :number;
  @Input() editActivityProjectModal;

  constructor(private activityService:ActivityService,private  autehntificationService:AuthenticationService,private activateRoute:ActivatedRoute){

    //this.idActivityProject = this.activateRoute.snapshot.params['id'];

  }

  hideModal() {
    this.editActivityProjectModal.hide();
  }

  ngOnInit(){
      /*this.activityService.getActivity(this.idActivityProject)
        .subscribe((data:ActivityProject)=>{
          this.activityProject = data;
          this.activityProject.dteStrt = new Date(this.activityProject.dteStrt);
          this.activityProject.dteEnd = new Date(this.activityProject.dteEnd);
          console.log("activityProject " + JSON.stringify(this.activityProject));
        },err=>{
          console.log(err);
        });*/
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
