import {Component, OnInit} from "@angular/core";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivityRecouvrement} from "../../model/model.activityRecouvrement";
import {ActivityService} from "../../services/activity.service";
import * as moment from "moment-timezone";
@Component({
  templateUrl: 'showActivityRecouvrement.component.html'
})
export class ShowActivityRecouvrementComponent implements OnInit{
  activityRecouvrement : ActivityRecouvrement = new ActivityRecouvrement();
  idActivityRecouvrement :number;

  constructor(private activityService:ActivityService,private  autehntificationService:AuthenticationService,private activateRoute:ActivatedRoute,private router:Router){
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

  onShowAllMyActivities(){
    this.router.navigate(["/activityRecouvrement/my-activities/"]);
  }




}
