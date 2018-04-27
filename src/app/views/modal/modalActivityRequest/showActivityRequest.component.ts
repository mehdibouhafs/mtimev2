import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from "moment-timezone";
import {ActivityService} from "../../../services/activity.service";
import {AuthenticationService} from "../../../services/authentification.service";
import {ActivityRequest} from "../../../model/model.activityRequest";
@Component({
  templateUrl: 'showActivityRequest.component.html'
})
export class ShowActivityRequestComponent implements OnInit{
  activityRequest : ActivityRequest = new ActivityRequest();
  idActivityRequest :number;

  constructor(private activityService:ActivityService,private  autehntificationService:AuthenticationService,private activateRoute:ActivatedRoute,private router:Router){
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

  onShowAllMyActivities(){
    this.router.navigate(["/activityRequest/my-activities/"]);
  }




}
