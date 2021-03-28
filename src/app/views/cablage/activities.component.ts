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
  templateUrl: 'activities.component.html'
})
export class ActivitiesComponent implements OnInit {

  customers: any;
  projects: any;
  pageActivities: any;
  motCle: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalElement: number;
  size: number = 10;
  pages: Array<number>;

  users: any;
  selectedUser: string;
  usersTypeahead = new EventEmitter<string>();

  disabledStatut:boolean = false;
  lastActivity : any;

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
    if (!this.authentificationService.isLogged())
      this.router.navigate(['/pages/login']);
    else {
      this.doSearch();
      this.serverSideSearch();
      this.activityService.getLastActivity().subscribe(
        data => {
          this.lastActivity = data;
        }, err => {
          console.log(err);
        }
      );
    }
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
        this.editactivityRequestModal.show();
        break;
      }







      case "Activité projet": {
        this.activityProject = JSON.parse(JSON.stringify(activity));
        this.activityProject.dteStrt = new Date(activity.dteStrt);
        this.activityProject.dteEnd = new Date(activity.dteEnd);
        this.disabledStatut = !this.activityService.testDateBeforeNow(activity.dteStrt, activity.dteEnd);
        this.chargerProjects();
        this.editactivityProjectModal.show();
        break;
      }

      case "Activité congé": {

        this.activityHoliday = JSON.parse(JSON.stringify(activity));
        this.activityHoliday.dteStrt = new Date(activity.dteStrt);
        this.activityHoliday.dteEnd = new Date(activity.dteEnd);
        this.disabledStatut = !this.activityService.testDateBeforeNow(activity.dteStrt, activity.dteEnd);
        this.editactivityHolidayModal.show();
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

    this.activityService.getActivityByService(this.selectedUser ? this.selectedUser : "", this.motCle, this.currentPage, this.size, this.typeSelected).subscribe(
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

}
