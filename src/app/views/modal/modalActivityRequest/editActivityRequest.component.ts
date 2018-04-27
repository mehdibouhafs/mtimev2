import {Component, OnInit} from "@angular/core";

import {ActivatedRoute, Router} from "@angular/router";

import * as moment from "moment-timezone";
import {ActivityService} from "../../../services/activity.service";
import {AuthenticationService} from "../../../services/authentification.service";
import {ActivityRequest} from "../../../model/model.activityRequest";
@Component({
  templateUrl: 'editActivityRequest.component.html'
})
export class EditActivityRequestComponent implements OnInit{
  mode:number=1;
  activityRequest : ActivityRequest = new ActivityRequest();
  idActivityRequest :number;

  constructor(private activityService:ActivityService,private  autehntificationService:AuthenticationService,private activateRoute:ActivatedRoute){

    this.idActivityRequest = this.activateRoute.snapshot.params['id'];

  }

  ngOnInit(){
    this.activityService.getActivity(this.idActivityRequest)
      .subscribe((data:ActivityRequest)=>{
        this.activityRequest = data;
        this.activityRequest.dteStrt = new Date(this.activityRequest.dteStrt);
        this.activityRequest.dteEnd = new Date(this.activityRequest.dteEnd);
        console.log("activityRequest " + JSON.stringify(this.activityRequest));
      },err=>{
        console.log(err);
      });
  }

  onEditActivityRequest() {
    this.activityService.updateActivity(this.activityRequest)
      .subscribe((data: ActivityRequest) => {
        console.log("ok " + data);
        this.activityRequest = data;
        this.mode = 2;
      }), err => {
      console.log(JSON.parse(err.body).message);
    };
  }


}
