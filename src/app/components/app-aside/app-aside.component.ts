import {Component, OnInit} from '@angular/core';
import {ActivityService} from "../../services/activity.service";
import {Activity} from "../../model/model.activity";

@Component({
  selector: 'app-aside',
  templateUrl: './app-aside.component.html'
})
export class AppAsideComponent implements OnInit {

  public activityToday:any;
  public activityTomorrow:any;



  constructor(private activityService:ActivityService) { }

  ngOnInit() {
    this.getActivityTodayTomorrow();
  }

  getActivityTodayTomorrow() {
    this.activityService.getActivityToday()
      .subscribe(data=>{
        this.activityToday = data;
      }, err=>{
        console.log(err);
      });

    this.activityService.getActivityTomorrow()
      .subscribe(data=>{
        this.activityTomorrow = data;
      }, err => {
        console.log(err);
      });
  }

}
