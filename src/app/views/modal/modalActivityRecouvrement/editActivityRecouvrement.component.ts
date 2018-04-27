import {Component, OnInit} from "@angular/core";

import {ActivatedRoute, Router} from "@angular/router";

import * as moment from "moment-timezone";
import {ActivityService} from "../../../services/activity.service";
import {AuthenticationService} from "../../../services/authentification.service";
import {ActivityRecouvrement} from "../../../model/model.activityRecouvrement";
@Component({
  templateUrl: 'editActivityRecouvrement.component.html'
})
export class EditActivityRecouvrementComponent implements OnInit{
  mode:number=1;
  activityRecouvrement : ActivityRecouvrement = new ActivityRecouvrement();
  idActivityRecouvrement :number;

  constructor(private activityService:ActivityService,private  autehntificationService:AuthenticationService,private activateRoute:ActivatedRoute){

    this.idActivityRecouvrement = this.activateRoute.snapshot.params['id'];

  }

  ngOnInit(){
    this.activityService.getActivity(this.idActivityRecouvrement)
      .subscribe((data:ActivityRecouvrement)=>{
        this.activityRecouvrement = data;
        this.activityRecouvrement.dteStrt = new Date(this.activityRecouvrement.dteStrt);
        this.activityRecouvrement.dteEnd = new Date(this.activityRecouvrement.dteEnd);
        console.log("activityRecouvrement " + JSON.stringify(this.activityRecouvrement));
      },err=>{
        console.log(err);
      });
  }

  onEditActivityRecouvrement() {
    this.activityService.updateActivity(this.activityRecouvrement)
      .subscribe((data: ActivityRecouvrement) => {
        console.log("ok " + data);
        this.activityRecouvrement = data;
        this.mode = 2;
      }), err => {
      console.log(JSON.parse(err.body).message);
    };
  }


}
