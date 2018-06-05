import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {ActivityService} from "../../services/activity.service";
import {Activity} from "../../model/model.activity";
import {AuthenticationService} from "../../services/authentification.service";

@Component({
  selector: 'app-new-activity',
  templateUrl: 'new-activity.component.html'
})

export class NewActivityComponent implements OnInit {

  @ViewChild('activityProjectModal') activityProjectModal;
  @ViewChild('activityCommercialModal') activityCommercialModal;
  @ViewChild('activityHolidayModal') activityHolidayModal;
  @ViewChild('activityRecouvrementModal') activityRecouvrementModal;
  @ViewChild('activityRequestModal') activityRequestModal;
  @ViewChild('activitySIModal') activitySIModal;

  activitiesAuthorozed = [];


  lastActivity: any;

  constructor(private activityService: ActivityService, private authenticationService: AuthenticationService) {

  }

  ngOnInit() {
    this.chargerActivitiesAuthorized();
  }

  chargerActivitiesAuthorized() {
    this.authenticationService.getRoles().forEach(authority => {
      switch (authority) {
        case "write_si_activity": {
          this.activitiesAuthorozed.push('activitySI');
          break;
        }
        case "write_recouvrement_activity": {
          this.activitiesAuthorozed.push('activityRecouvrement');
          break;
        }
        case "write_request_activity": {
          this.activitiesAuthorozed.push('activityRequest');
          break;
        }
        case "write_project_activity": {
          this.activitiesAuthorozed.push('activityProject');
          break;
        }
        case "write_commercial_activity": {
          this.activitiesAuthorozed.push('activityCommercial');
          break;
        }
        case "write_holiday_activity": {
          this.activitiesAuthorozed.push('activityHoliday');
          break;
        }
      }
    });
  }

  getLastActivity() {
    this.activityService.getLastActivity()
      .subscribe((data) => {
        this.lastActivity = data;
      }, err => {
        console.log(err);
      });
  }

  onSelectModal(modalSelected: string) {
    this.getLastActivity();
    switch (modalSelected) {
      case "activityProject": {
        this.activityProjectModal.show();
        break;
      }

      case "activityRecouvrement": {
        this.activityRecouvrementModal.show();
        break;
      }

      case "activityRequest": {
        this.activityRequestModal.show();
        break;
      }

      case "activityHoliday": {
        this.activityHolidayModal.show();
        break;
      }

      case "activitySI": {
        this.activitySIModal.show();
        break;
      }

      case "activityCommercial": {
        this.activityCommercialModal.show();
        break;
      }
    }
  }

  detectIcon(type: string) {
    switch (type) {
      case "activityRequest": {
        return "fa fa-bullhorn";
      }
      case "activityProject": {
        return "fa fa-product-hunt";
      }
      case "activityRecouvrement": {
        return "fa fa-briefcase";
      }
      case "activityHoliday": {
        return "fa fa-plane";
      }
      case "activityCommercial": {
        return "fa fa-shopping-cart";
      }
      case "activitySI": {
        return "fa fa-support";
      }
    }
  }

  detectName(type: string) {
    switch (type) {
      case "activityRequest": {
        return "Activité Support";
      }
      case "activityProject": {
        return "Activité Projet";
      }
      case "activityRecouvrement": {
        return "Activité Recouvrement";
      }
      case "activityHoliday": {
        return "Activité Congé";
      }
      case "activityCommercial": {
        return "Activité Commerciale";
      }
      case "activitySI": {
        return "Activité Support SI";
      }
    }
  }

}
