import {ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild} from "@angular/core";
import {ActivityService} from "../../services/activity.service";
import {UserService} from "../../services/user.service";
import {AuthenticationService} from "../../services/authentification.service";
import {ProjectService} from "../../services/project.service";
import {CustomerService} from "../../services/customer.service";
import {Router} from "@angular/router";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {Activity} from "../../model/model.activity";
import {ActivityRequest} from "../../model/model.activityRequest";
import {ActivitySI} from "../../model/model.activitySI";
import {ActivityRecouvrement} from "../../model/model.activityRecouvrement";
import {ActivityCommercial} from "../../model/model.activityCommercial";
import {ActivityProject} from "../../model/model.activityProject";
import {ActivityHoliday} from "../../model/model.activityHoliday";

@Component({
  templateUrl: 'activity-responsable.component.html'
})
export class ActivityResponsableComponent implements OnInit {

  customers: any;
  projects: any;
  pageActivities: any;
  motCle: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalElement: number;
  size: number = 10;
  pages: Array<number>;

  users = [
    {username:'stage01', firstName: 'Stage', lastName: '01', service: {servName: 'Système d\'information - SI'}},
    {username:'abassou', firstName: 'Ahmed', lastName: 'Bassou', service: {servName: 'Système d\'information - SI'}},
    {username:'dalami', firstName: 'Driss', lastName: 'Alami Chentoufi', service: {servName: 'Value Système'}},
    {username:'mkarche', firstName: 'Mohamed', lastName: 'Karche', service: {servName: 'Projet'}},
    {username:'mziadi', firstName: 'Ilyas', lastName: 'Ziadi Mohamed', service: {servName: 'Value Réseaux et Sécurité'}},
    {username:'mbelaouchi', firstName: 'Mounir', lastName: 'Belaouchi ', service: {servName: 'Value Software'}},
    {username:'tbenchekroun', firstName: 'Tarik', lastName: 'BENCHEKROUN ', service: {servName: 'Commercial'}},
    {username:'mlaazimani', firstName: 'Mohamed', lastName: 'LAAZIMANI', service: {servName: 'Avant Vente'}}
  ];
  selectedUser: string;
  usersTypeahead = new EventEmitter<string>();

  disabledStatut:boolean = false;


  items = [
    {
      type: "Activité support",
      logo: "fa fa-bullhorn",
      shortType: "AS"
    },

    {
      type: "Activité projet",
      logo: "fa fa-product-hunt",
      shortType: "AP"
    },


    {
      type: "Activité congé",
      logo: "fa fa-plane",
      shortType: "AC"
    }
  ];
  typeSelected = [];

  activity: Activity = new Activity();
  activityRequest: ActivityRequest = new ActivityRequest();
  activityProject: ActivityProject = new ActivityProject();
  activityHoliday: ActivityHoliday = new ActivityHoliday();

  @ViewChild('activityHolidayModal')
  activityHolidayModal;


  @ViewChild('activityRequestModal')
  activityRequestModal;

  @ViewChild('activityProjectModal')
  activityProjectModal;

  @ViewChild('editactivityProjectModal')
  editactivityProjectModal;

  @ViewChild('editactivityHolidayModal')
  editactivityHolidayModal;

  @ViewChild('editactivityRequestModal')
  editactivityRequestModal;

  dureeConverted:string;


  constructor(public activityService: ActivityService, private userService: UserService, private  authentificationService: AuthenticationService, private projectService: ProjectService, private customerService: CustomerService, private router: Router, private ref: ChangeDetectorRef) {
  }

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";

  ngOnInit() {
    this.doSearch();
    this.serverSideSearch();
  }

  private serverSideSearch() {
    this.usersTypeahead.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      switchMap(term => this.userService.searchUsersByService(term))
    ).subscribe(x => {
      this.ref.markForCheck();
      this.users = x["content"];
    }, (err) => {
      console.log(err);
      this.users = [];
    });
  }

  detectModal(activity: any) {
    switch (activity.typeActivite) {

      case "Activité congé": {
        this.activityHoliday = activity;
        this.activityHolidayModal.show();
        break;
      }

      case "Activité projet": {
        this.activityProject = activity;
        this.activityProjectModal.show();
        break;
      }


      case "Activité support": {
        this.activityRequest = activity;
        this.activityRequestModal.show();
        break;
      }
      default: {
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


      case "Activité support": {
        this.editactivityRequestModal.show();
        break;
      }

    }

  }

  selectActivity(activity: any) {
    this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.activityService.diffBetwenTwoDateInMinutes(activity.dteStrt, activity.dteEnd));

    switch (activity.typeActivite) {
      case "Activité support" : {
        this.activityRequest = JSON.parse(JSON.stringify(activity));
        this.activityRequest.dteStrt = new Date(activity.dteStrt);
        this.activityRequest.dteEnd = new Date(activity.dteEnd);
        this.disabledStatut = !this.activityService.testDateBeforeNow(activity.dteStrt, activity.dteEnd);
        break;
      }

      case "Activité projet": {
        this.activityProject = JSON.parse(JSON.stringify(activity));
        this.activityProject.dteStrt = new Date(activity.dteStrt);
        this.activityProject.dteEnd = new Date(activity.dteEnd);
        this.disabledStatut = !this.activityService.testDateBeforeNow(activity.dteStrt, activity.dteEnd);
        this.chargerProjects();
        break;
      }

      case "Activité congé": {

        this.activityHoliday = JSON.parse(JSON.stringify(activity));
        this.activityHoliday.dteStrt = new Date(activity.dteStrt);
        this.activityHoliday.dteEnd = new Date(activity.dteEnd);
        this.disabledStatut = !this.activityService.testDateBeforeNow(activity.dteStrt, activity.dteEnd);
        break;
      }

      default : {
        break;
      }
    }
  }


  chercher() {
    this.doSearch();
  }

  doSearch() {
    console.log("motCle " + this.motCle);

    this.activityService.getActivityPlanifiedDirection(this.selectedUser ? this.selectedUser : "", this.motCle, this.currentPage, this.size).subscribe(
      data => {
        this.pageActivities = data;
        this.pages = new Array(data["totalPages"]);
        this.totalElement = data["totalElements"];

      }, err => {
        this.authentificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
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

  onDeleteMyActivity(activity:Activity){

    this.activityService.deleteActivity(activity.id)
      .subscribe(data => {
        this.ngOnInit();
      }, err => {
        console.log("err delete");
      });

  }

}
