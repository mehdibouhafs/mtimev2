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
import {CustomerService} from "../../services/customer.service";
import {ProjectService} from "../../services/project.service";
import {ActivityPM} from "../../model/model.activityPM";
import {ActivityAvantVente} from "../../model/model.activityAvantVente";
import {ActivityDevCompetence} from "../../model/model.activityDevCompetence";
import {User} from "../../model/model.user";

@Component({
  templateUrl: 'myactivitiess.component.html'
})
export class MyActivitiessComponent implements OnInit {


  customers: any;
  projects: any;

  pageActivities: any;
  motCle: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalElement: number;
  size: number = 10;
  pages: Array<number>;

  disabledStatus: boolean = false;

  lastActivity : any;

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
  activitiesAuthorized = [];

  dureeConverted: string;
  activity: Activity = new Activity();
  activityRequest: ActivityRequest = new ActivityRequest();
  activitySI: ActivitySI = new ActivitySI();
  activityRecouvrement: ActivityRecouvrement = new ActivityRecouvrement();
  activityCommercial: ActivityCommercial = new ActivityCommercial();
  activityProject: ActivityProject = new ActivityProject();
  activityHoliday: ActivityHoliday = new ActivityHoliday();
  activityPM: ActivityPM = new ActivityPM();
  activityAvantVente: ActivityAvantVente = new ActivityAvantVente();
  activityDevCompetence: ActivityDevCompetence = new ActivityDevCompetence();

  @ViewChild('newactivitySIModal')
  newactivitySIModal;
  @ViewChild('newactivityRequestModal')
  newactivityRequestModal;
  @ViewChild('newactivityProjectModal')
  newactivityProjectModal;
  @ViewChild('newactivityCommercialModal')
  newactivityCommercialModal;
  @ViewChild('newactivityRecouvrementModal')
  newactivityRecouvrementModal;
  @ViewChild('newactivityHolidayModal')
  newactivityHolidayModal;
  @ViewChild('newactivityPMModal')
  newactivityPMModal;
  @ViewChild('newactivityAvantVenteModal')
  newactivityAvantVenteModal;
  @ViewChild('newactivityDevCompetenceModal')
  newactivityDevCompetenceModal;

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
  @ViewChild('activityPMModal')
  activityPMModal;
  @ViewChild('activityAvantVenteModal')
  activityAvantVenteModal;
  @ViewChild('activityDevCompetenceModal')
  activityDevCompetenceModal;


  @ViewChild('editactivitySIModal')
  editactivitySIModal;
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
  @ViewChild('editactivityPMModal')
  editactivityPMModal;
  @ViewChild('editactivityAvantVenteModal')
  editactivityAvantVenteModal;
  @ViewChild('editactivityDevCompetenceModal')
  editactivityDevCompetenceModal;


  constructor( public activityService: ActivityService, private projectService: ProjectService, private customerService: CustomerService, private authentificationService: AuthenticationService, private router: Router) {
  }

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";

  ngOnInit() {
    if(!this.authentificationService.isLogged())
      this.router.navigate(['/pages/login']);
    else {
      this.chargerActivitiesAuthorized();
      this.doSearch();
      this.activityService.getLastActivity().subscribe(
        data=>{
          this.lastActivity = data;
        }, err=>{
          console.log(err);
        }
      );
    }

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

      case "Activité PM": {
        this.activityPMModal.show();
        break;
      }

      case "Activité avant vente": {
        this.activityAvantVenteModal.show();
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

    this.activityService.getMyActivitiesByMc(this.motCle, this.currentPage, this.size, this.typeSelected).subscribe(
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
    this.activity.user = new User();
    this.activity.user.username = this.authentificationService.getUserName();
    this.activity.createdBy = new User();
    this.activity.createdBy.username = this.authentificationService.getUserName();
    this.indexSelected = this.pageActivities.content.indexOf(activity);
    this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.activityService.diffBetwenTwoDateInMinutes(activity.dteStrt, activity.dteEnd));
    this.activity = JSON.parse(JSON.stringify(activity));
    this.disabledStatus = !this.activityService.testDateBeforeNow(activity.dteStrt, activity.dteEnd);

    switch (activity.typeActivite) {
      case "Activité support" : {
        this.activityRequest = JSON.parse(JSON.stringify(activity));
        this.activityRequest.dteStrt = new Date(activity.dteStrt);
        this.activityRequest.dteEnd = new Date(activity.dteEnd);
        this.activityRequest.duration=activity.hrEnd;
        break;
      }

      case "Activité PM" : {
        this.activityPM = JSON.parse(JSON.stringify(activity));
        this.activityPM.dteStrt = new Date(activity.dteStrt);
        this.activityPM.dteEnd = new Date(activity.dteEnd);
        this.activityPM.duration=activity.hrEnd;
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

      case "Activité avant vente": {
        this.activityAvantVente = JSON.parse(JSON.stringify(activity));
        this.activityAvantVente.dteStrt = new Date(activity.dteStrt);
        this.activityAvantVente.dteEnd = new Date(activity.dteEnd);
        this.activityAvantVente.duration=activity.hrEnd;
        break;
      }

      case "Activité dev competence": {
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

  selectActivityToDuppliquer(activity: any) {
    this.activity.user = new User();
    this.activity.user.username = this.authentificationService.getUserName();
    this.activity.createdBy = new User();
    this.activity.createdBy.username = this.authentificationService.getUserName();
    this.indexSelected = this.pageActivities.content.indexOf(activity);
    this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.activityService.diffBetwenTwoDateInMinutes(activity.dteStrt, activity.dteEnd));
    this.activity = JSON.parse(JSON.stringify(activity));

    this.disabledStatus = false;
    console.log("type "+ activity.typeActivite);
    switch (activity.typeActivite) {
      case "Activité support" : {
        this.activityRequest = JSON.parse(JSON.stringify(activity));
        this.activityRequest.dteStrt = null;
        this.activityRequest.dteEnd = null;
        this.activityRequest.duration=null;
        this.activityRequest.durtion=null;
      }

      case "Activité PM" : {
        this.activityPM = JSON.parse(JSON.stringify(activity));
        this.activityPM.dteStrt = null;
        this.activityPM.dteEnd = null;
        this.activityPM.duration=null;
        this.activityPM.durtion=null;
        break;
      }

      case "Activité SI" : {
        this.activitySI = JSON.parse(JSON.stringify(activity));
        this.activitySI.dteStrt = null;
        this.activitySI.dteEnd = null;
        this.activitySI.duration=null;
        this.activitySI.durtion=null;
        break;
      }

      case "Activité commerciale": {
        this.activityCommercial = JSON.parse(JSON.stringify(activity));
        this.activityCommercial.dteStrt = null;
        this.activityCommercial.dteEnd = null;
        this.activityCommercial.duration=null;
        break;
      }

      case "Activité recouvrement": {
        this.activityRecouvrement = JSON.parse(JSON.stringify(activity));
        this.activityRecouvrement.dteStrt =null;
        this.activityRecouvrement.dteEnd = null;
        this.activityRecouvrement.duration=null;
        break;
      }

      case "Activité projet": {
        this.activityProject = JSON.parse(JSON.stringify(activity));
        this.activityProject.dteStrt = null;
        this.activityProject.dteEnd = null;
        this.activityProject.duration=null;
        this.activityProject.durtion=null;
        this.chargerProjects();
        break;
      }

      case "Activité congé": {

        this.activityHoliday = JSON.parse(JSON.stringify(activity));
        this.activityHoliday.dteStrt = null;
        this.activityHoliday.dteEnd = null;
        break;
      }

      case "Activité avant vente": {
        this.activityAvantVente = JSON.parse(JSON.stringify(activity));
        this.activityAvantVente.dteStrt = null;
        this.activityAvantVente.dteEnd = null;
        this.activityAvantVente.duration=null;
        this.activityAvantVente.durtion=null;
        break;
      }

      case "Activité dev competence": {
        this.activityDevCompetence = JSON.parse(JSON.stringify(activity));
        this.activityDevCompetence.dteStrt = null;
        this.activityDevCompetence.dteEnd = null;
        this.activityDevCompetence.duration=null;
        this.activityDevCompetence.durtion=null;
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

  loadCustomers() {
    this.customerService.getCustomers().subscribe(
      data => {
        this.customers = data["_embedded"]["customers"];
      }, err => {
        console.log(err);
      });
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
          console.log(err);
        });
    }
  }

  onDuppliquerMyActivity(activity: Activity) {
    activity.id = null;
    this.selectActivityToDuppliquer(activity);

    switch (activity.typeActivite) {
      case "Activité projet": {
        this.newactivityProjectModal.show();
        break;
      }
      case "Activité congé": {
        this.newactivityHolidayModal.show();
        break;
      }
      case "Activité commerciale": {
        this.newactivityCommercialModal.show();
        break;
      }
      case "Activité recouvrement": {
        this.newactivityRecouvrementModal.show();
        break;
      }
      case "Activité support": {
        this.newactivityRequestModal.show();
        break;
      }
      case "Activité SI": {
        this.newactivitySIModal.show();
        break;
      }
      case "Activité PM": {
        this.newactivityPMModal.show();
        break;
      }
      case "Activité avant vente": {
        this.newactivityAvantVenteModal.show();
        break;
      }
      case "Activité dev competence": {
        this.newactivityDevCompetenceModal.show();
        break;
      }
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
      case "Activité PM": {
        this.editactivityPMModal.show();
        break;
      }
      case "Activité avant vente": {
        this.editactivityAvantVenteModal.show();
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
      case "Activité développement des compétences": {
        return "fa fa-graduation-cap";
      }
    }
  }

  chargerActivitiesAuthorized() {
    let found = false;
    this.activitiesAuthorized = [];
    this.authentificationService.getRoles().forEach(authority => {
      switch (authority) {
        case "write_si_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité SI')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité SI');
          found=false;
          break;
        }
        case "write_recouvrement_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité recouvrement')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité recouvrement');
          found=false;
          break;
        }
        case "write_request_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité support')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité support');
          found=false;
          break;
        }
        case "write_project_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité projet')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité projet');
          found=false;
          break;
        }
        case "write_commercial_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité commerciale')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité commerciale');
          found=false;
          break;
        }
        case "write_holiday_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité congé')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité congé');
          found=false;
          break;
        }

        case "write_pm_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité PM')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité PM');
          found=false;
          break;
        }

        case "write_avant_vente_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité avant vente')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité avant vente');
          found=false;
          break;
        }

        case "write_dev_competence_activity": {
          this.activitiesAuthorized.forEach(a => {
            if (a == 'Activité dev competence')
              found = true;
          });
          if (!found)
            this.activitiesAuthorized.push('Activité développement des compétences');
          found=false;
          break;
        }
      }
    });
  }

  onSelectModal(modalSelected: string) {
    switch (modalSelected) {
      case "Activité projet": {
        this.newactivityProjectModal.show();
        break;
      }

      case "Activité recouvrement": {
        this.newactivityRecouvrementModal.show();
        break;
      }

      case "Activité support": {
        this.newactivityRequestModal.show();
        break;
      }

      case "Activité congé": {
        this.newactivityHolidayModal.show();
        break;
      }

      case "Activité SI": {
        this.newactivitySIModal.show();
        break;
      }

      case "Activité commerciale": {
        this.newactivityCommercialModal.show();
        break;
      }

      case "Activité PM": {
        this.newactivityPMModal.show();
        break;
      }

      case "Activité avant vente": {
        this.newactivityAvantVenteModal.show();
        break;
      }

      case "Activité développement des compétences": {
        this.newactivityDevCompetenceModal.show();
        break;
      }
    }
  }

}
