import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router";
import {Activity} from "../../model/model.activity";
import {ActivityService} from "../../services/activity.service";
import {ActivityRequest} from "../../model/model.activityRequest";
import {ActivityRecouvrement} from "../../model/model.activityRecouvrement";
import {ActivityCommercial} from "../../model/model.activityCommercial";
import {ActivityProject} from "../../model/model.activityProject";
import {ActivityHoliday} from "../../model/model.activityHoliday";
import * as moment from "moment";
import _date = moment.unitOfTime._date;
import {ActivitySI} from "../../model/model.activitySI";
import {ProjectService} from "../../services/project.service";
import {CustomerService} from "../../services/customer.service";
import {ActivityDevCompetence} from "../../model/model.activityDevCompetence";

@Component({
  templateUrl: 'allactivities.component.html'
})
export class AllactivitiesComponent implements OnInit {

  customers: any;
  projects: any;
  pageActivities: any;
  motCle: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalElement: number;
  size: number = 10;
  pages: Array<number>;

  indexSelected: any;

  items = [
    {
      type: "Activité support",
      logo: "fa fa-bullhorn",
      shortType: "AS"
    },
    {
      type: "Activité commerciale",
      logo: "fa fa-shopping-cart",
      shortType: "ACM"
    },
    {
      type: "Activité projet",
      logo: "fa fa-product-hunt",
      shortType: "AP"
    },
    {
      type: "Activité SI",
      logo: "fa fa-support",
      shortType: "ASSI"
    },
    {
      type: "Activité recouvrement",
      logo: "fa fa-briefcase",
      shortType: "AR"
    },
    {
      type: "Activité congé",
      logo: "fa fa-plane",
      shortType: "AC"
    }
  ];
  typeSelected = [];

  dureeConverted: string;
  activity: Activity = new Activity();
  activityRequest: ActivityRequest = new ActivityRequest();
  activitySI: ActivitySI = new ActivitySI();
  activityRecouvrement: ActivityRecouvrement = new ActivityRecouvrement();
  activityCommercial: ActivityCommercial = new ActivityCommercial();
  activityProject: ActivityProject = new ActivityProject();
  activityHoliday: ActivityHoliday = new ActivityHoliday();
  activityDevCompetence: ActivityDevCompetence = new ActivityDevCompetence();

  @ViewChild('activityCommercialModal')
  activityCommercialModal;

  @ViewChild('activityHolidayModal')
  activityHolidayModal;

  @ViewChild('activitySIModal')
  activitySIModal;

  @ViewChild('activityRequestModal')
  activityRequestModal;

  @ViewChild('activityProjectModal')
  activityProjectModal;

  @ViewChild('activityRecouvrementModal')
  activityRecouvrementModal;

  @ViewChild('activityDevCompetenceModal')
  activityDevCompetenceModal;

  @ViewChild('editactivityRecouvrementModal')
  editactivityRecouvrementModal;

  @ViewChild('editactivityProjectModal')
  editactivityProjectModal;

  @ViewChild('editactivityCommercialModal')
  editactivityCommercialModal;

  @ViewChild('editactivityHolidayModal')
  editactivityHolidayModal;

  @ViewChild('editactivityRequestModal')
  editactivityRequestModal;

  @ViewChild('editactivitySIModal')
  editactivitySIModal;

  @ViewChild('editactivityDevCompetenceModal')
  editactivityDevCompetenceModal;

  constructor(public activityService: ActivityService, private  authentificationService: AuthenticationService, private projectService: ProjectService, private customerService: CustomerService, private router: Router) {
  }

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";

  ngOnInit() {
    if (!this.authentificationService.isLogged())
      this.router.navigate(['/pages/login']);
    else
      this.doSearch();
  }

  detectModal(activity: any) {
    this.selectActivity(activity);
    switch (activity.typeActivite) {
      case "Activité commerciale": {
        this.activityCommercialModal.show();
        break;
      }

      case "Activité SI": {
        this.activitySIModal.show();
        break;
      }

      case "Activité congé": {
        this.activityHolidayModal.show();
        break;
      }

      case "Activité projet": {
        this.activityProjectModal.show();
        break;
      }

      case "Activité recouvrement": {
        this.activityRecouvrementModal.show();
        break;
      }

      case "Activité support": {
        this.activityRequestModal.show();
        break;
      }
      case "Activité dev competence": {
        this.activityDevCompetenceModal.show();
        break;
      }
      default: {
        break;
      }
    }
  }

  chercher() {
    this.doSearch();
  }

  doSearch() {
    console.log("motCle " + this.motCle);

    this.activityService.getAllActivitiesByMc(this.motCle, this.currentPage, this.size, this.typeSelected).subscribe(
      data => {
        this.pageActivities = data;
        this.pages = new Array(data["totalPages"]);
        this.totalElement = data["totalElements"];

      }, err => {
        this.authentificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }

  selectActivity(activity: any) {
    this.indexSelected = this.pageActivities.content.indexOf(activity);
    this.activity = JSON.parse(JSON.stringify(activity));

    this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.activityService.diffBetwenTwoDateInMinutes(activity.dteStrt, activity.dteEnd));
    switch (activity.typeActivite) {
      case "Activité support" : {
        this.activityRequest = JSON.parse(JSON.stringify(activity));
        this.activityRequest.dteStrt = new Date(activity.dteStrt);
        this.activityRequest.dteEnd = new Date(activity.dteEnd);
        this.activityRequest.duration=activity.hrEnd;
        break;
      }

      case "Activité SI" : {
        this.activitySI = JSON.parse(JSON.stringify(activity));
        this.activitySI.dteStrt = new Date(activity.dteStrt);
        this.activitySI.dteEnd = new Date(activity.dteEnd);
        this.activitySI.duration=activity.hrEnd;
        break;
      }

      case "Activité commerciale": {
        this.activityCommercial = JSON.parse(JSON.stringify(activity));
        this.activityCommercial.dteStrt = new Date(activity.dteStrt);
        this.activityCommercial.dteEnd = new Date(activity.dteEnd);
        this.activityCommercial.duration=activity.hrEnd;
        break;
      }

      case "Activité recouvrement": {
        this.activityRecouvrement = JSON.parse(JSON.stringify(activity));
        this.activityRecouvrement.dteStrt = new Date(activity.dteStrt);
        this.activityRecouvrement.dteEnd = new Date(activity.dteEnd);
        this.activityRecouvrement.duration=activity.hrEnd;
        break;
      }

      case "Activité projet": {
        this.activityProject = JSON.parse(JSON.stringify(activity));
        this.activityProject.dteStrt = new Date(activity.dteStrt);
        this.activityProject.dteEnd = new Date(activity.dteEnd);
        this.activityProject.duration=activity.hrEnd;
        this.chargerProjects();
        break;
      }

      case "Activité congé": {

        this.activityHoliday = JSON.parse(JSON.stringify(activity));
        this.activityHoliday.dteStrt = new Date(activity.dteStrt);
        this.activityHoliday.dteEnd = new Date(activity.dteEnd);
        break;
      }
      case "Activité dev competence" : {
        this.activityDevCompetence = JSON.parse(JSON.stringify(activity));
        this.activityDevCompetence.dteStrt = new Date(activity.dteStrt);
        this.activityDevCompetence.dteEnd = new Date(activity.dteEnd);
        this.activityDevCompetence.duration=activity.hrEnd;
        break;
      }

      default : {
        break;
      }
    }
  }


  gotoPage(page: number) {
    this.currentPage = page;
    this.doSearch();
  }

  chargerProjects() {
    this.projects = [];
    if (this.activityProject.customer.code != null) {
      this.projectService.getProjectsByCustomer(this.activityProject.customer.code).subscribe(
        data => {
          this.projects = data;
          console.log("dev");
          console.log(data);
          //console.log("projects customer " + JSON.stringify(this.projects));
        }, err => {
          this.authentificationService.logout();
          this.router.navigateByUrl('/pages/login');

        });
    }
  }

  onEditMyActivity(activity: Activity) {

    this.selectActivity(activity);
    switch (activity.typeActivite) {
      case "Activité projet": {
        this.editactivityProjectModal.show();
        break;
      }
      case "Activité congé": {
        this.editactivityHolidayModal.show();
        break;
      }
      case "Activité commerciale": {
        this.editactivityCommercialModal.show();
        break;
      }
      case "Activité recouvrement": {
        this.editactivityRecouvrementModal.show();
        break;
      }
      case "Activité support": {
        this.editactivityRequestModal.show();
        break;
      }
      case "Activité SI": {
        this.editactivitySIModal.show();
        break;
      }

      case "Activité dev competence": {
        this.editactivityDevCompetenceModal.show();
        break;
      }
    }

  }

  onDeleteMyActivity(activity: Activity) {

    this.activityService.deleteActivity(activity.id)
      .subscribe(data => {
        this.pageActivities.content.splice(
          this.indexSelected, 1
        )
      }, err => {
        console.log("err");
      });

  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe(
      data => {
        this.customers = data["_embedded"]["customers"];
        console.log("customers " + JSON.stringify(this.customers));
      }, err => {
        this.authentificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }


}
