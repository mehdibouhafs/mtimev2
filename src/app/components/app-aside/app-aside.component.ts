import {Component, OnInit} from '@angular/core';
import {ActivityService} from "../../services/activity.service";
import {Activity} from "../../model/model.activity";
import {FormationService} from "../../services/formation.service";
import {CertificationService} from "../../services/certification.service";
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router"

@Component({
  selector: 'app-aside',
  templateUrl: './app-aside.component.html'
})
export class AppAsideComponent implements OnInit {

  public activityToday: any;
  public activityTomorrow: any;
  public formationThisMonth: any;
  public formationNextMonth: any;
  public certificationThisMonth: any;
  public certificationNextMonth: any;


  constructor(private router: Router, private authenticationService: AuthenticationService, private activityService: ActivityService, private formationService: FormationService, private certificationService: CertificationService) {
  }

  ngOnInit() {
    if (!this.authenticationService.isLogged())
      this.router.navigateByUrl('/pages/login');
    else
      this.getActivityTodayTomorrow();
  }

  getActivityTodayTomorrow() {
    this.activityService.getActivityToday()
      .subscribe(data => {
        this.activityToday = data;
      }, err => {
        console.log(err);
      });

    this.activityService.getActivityTomorrow()
      .subscribe(data => {
        this.activityTomorrow = data;
      }, err => {
        console.log(err);
      });
  }

  getFormationThisMonth() {

  }

  getFormationNextMonth() {

  }

  getCertificationThisMonth() {

  }

  getCertificationNextMonth() {

  }

}
