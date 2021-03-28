import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {ActivityService} from "../../services/activity.service";
import {Activity} from "../../model/model.activity";
import {AuthenticationService} from "../../services/authentification.service";
import {CustomerService} from "../../services/customer.service";
import {Router} from "@angular/router";

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
  @ViewChild('activityDevCompetenceModal') activityDevCompetenceModal;

  activitiesAuthorized = [];


  lastActivity: any;
  customers:any;

  constructor(private activityService: ActivityService, private customerService:CustomerService, private authenticationService: AuthenticationService, private router:Router) {

  }

  ngOnInit() {
    this.chargerActivitiesAuthorized();
    this.loadCustomers();
  }

  chargerActivitiesAuthorized() {
    this.authenticationService.getRoles().forEach(authority => {
      switch (authority) {
        case "write_si_activity": {
          this.activitiesAuthorized.push('activitySI');
          break;
        }
        case "write_recouvrement_activity": {
          this.activitiesAuthorized.push('activityRecouvrement');
          break;
        }
        case "write_request_activity": {
          this.activitiesAuthorized.push('activityRequest');
          break;
        }
        case "write_project_activity": {
          this.activitiesAuthorized.push('activityProject');
          break;
        }
        case "write_commercial_activity": {
          this.activitiesAuthorized.push('activityCommercial');
          break;
        }
        case "write_holiday_activity": {
          this.activitiesAuthorized.push('activityHoliday');
          break;
        }
        case "write_dev_competence_activity": {
          this.activitiesAuthorized.push('ActivitéDevCompetence');
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

  loadCustomers(){
    this.customerService.getCustomers().subscribe(
      data=>{
        this.customers = data["_embedded"]["customers"];
        console.log("customers " + JSON.stringify(this.customers));
      },err=>{
        this.authenticationService.logout();
        this.router.navigateByUrl('/pages/login');
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

      case "activityDevCompetence": {
        this.activityDevCompetenceModal.show();
        break;
      }
    }
  }

  detectIcon(type: string) {
    switch (type) {
      case "Activité support": {
        return "fa fa-bullhorn";
      }
      case "Activité projet": {
        return "fa fa-product-hunt";
      }
      case "Activité recouvrement": {
        return "fa fa-briefcase";
      }
      case "Activité congé": {
        return "fa fa-plane";
      }
      case "Activité commerciale": {
        return "fa fa-shopping-cart";
      }
      case "Activité SI": {
        return "fa fa-support";
      }
      case "Activité PM": {
        return "fa fa-wrench";
      }
      case "Activité avant vente": {
        return "fa fa-magnet";
      }
      case "Activité dev competence": {
        return "fa fa-graduation-cap";
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
      case "activityDevCompetence": {
        return "Activité dev competence";
      }
    }
  }

}
