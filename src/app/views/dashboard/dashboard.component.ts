import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from "../../services/authentification.service";
import {DashboardService} from "../../services/dashboard.service";
import {current} from "codelyzer/util/syntaxKind";
import {ActivityService} from "../../services/activity.service";
import {Activity} from "../../model/model.activity";
import index from "@angular/cli/lib/cli";
import {ActivityRequest} from "../../model/model.activityRequest";
import {ActivitySI} from "../../model/model.activitySI";
import {ActivityRecouvrement} from "../../model/model.activityRecouvrement";
import {ActivityCommercial} from "../../model/model.activityCommercial";
import {ActivityProject} from "../../model/model.activityProject";
import {ActivityHoliday} from "../../model/model.activityHoliday";
import {ProjectService} from "../../services/project.service";
import {CustomerService} from "../../services/customer.service";
import {ActivityAvantVente} from "../../model/model.activityAvantVente";

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  activity: Activity = new Activity();

  projects: any;
  dureeConverted: string;


  pageActivitiesHoliday: any;
  currentPageHoliday: number = 1;
  itemsPerPageHoliday: number = 5;
  totalElementHoliday: number;
  sizeHoliday: number = 5;
  pagesHoliday: Array<number>;

  pageActivities: any;
  motCle: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalElement: number;
  size: number = 5;
  pages: Array<number>;

  disabledStatut: boolean;

  indexSelected: any;
  indexSelectedHoliday: any;
  activityRequest: ActivityRequest = new ActivityRequest();
  activitySI: ActivitySI = new ActivitySI();
  activityRecouvrement: ActivityRecouvrement = new ActivityRecouvrement();
  activityCommercial: ActivityCommercial = new ActivityCommercial();
  activityProject: ActivityProject = new ActivityProject();
  activityHoliday: ActivityHoliday = new ActivityHoliday();
  activityAvantVente:ActivityAvantVente = new ActivityAvantVente();

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

  @ViewChild('editactivityAvantVenteModal')
  editactivityAvantVenteModal;

  tasks: any;
  public statistics: any;
  public currentDate: Date = new Date();
  public months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];

  // Pie
  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartLabels1: string[] = [];
  public pieChartData1: number[] = [];
  public pieChartType = 'pie';
  public options;
  public options1;

  //line
  public lineChartType = 'line';
  public lineChartLabels: string[] = [];
  public data = [];
  public dataDurtionEstime = [];
  public lineChartData = [];
  public optionsLine;

  //bar
  public barChartType = 'bar';
  public barChartLabels: string[] = [];
  public barChartData = [];
  public bardata = []
  public optionsbar;

  constructor(public authService: AuthenticationService, private dashboardService: DashboardService, private projectService: ProjectService, private customerService: CustomerService, private activityService: ActivityService, private router: Router) {

  }

  ngOnInit() {

    if(!this.authService.isLogged())
      this.router.navigate(['/pages/login']);
    else {
      console.log('aaaaaaaaaaaaaaaaa');
      this.doSearch();
      this.getActivityHoliday();

      this.dashboardService.getStatistics()
        .subscribe(data => {
            this.statistics = data;

            this.options = {
              title: {
                display: true,
                text: "Répartition par type d'"+"activité"
              }
            };
            this.options1 = {
              title: {
                display: true,
                text: "Nombre d'"+"activités par client"
              }
            };

            this.optionsLine = {
              title: {
                display: true,
                text: 'La charge de travail par rapport à la capacité'
              },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }],
                xAxes: [{
                  ticks: {
                    autoSkip: false
                  }
                }]
              }
            };

            this.pieChartLabels = [];
            this.pieChartData = [];
            this.statistics.activityParType.forEach(oneType => {
              this.pieChartLabels.push(oneType.type);
              this.pieChartData.push(+((oneType.nbre*100)/this.statistics.realisedActivities).toFixed(1));
            });

            this.pieChartLabels1 = [];
            this.pieChartData1 = [];
            this.statistics.activityParCustomer.forEach(oneCustomer => {
              this.pieChartLabels1.push(oneCustomer.name);
              this.pieChartData1.push(oneCustomer.nbreActivities);
            });

            this.lineChartLabels = [];
            this.data = [];
            this.statistics.durtionActivityParMonth.forEach(oneMonth => {
              this.lineChartLabels.push(this.months[oneMonth.month - 1] + ' ' + oneMonth.year);
              this.data.push((oneMonth.durtion/510).toFixed(1));
            });

            this.dataDurtionEstime = [];
            this.statistics.durtionEstimeParMonth.forEach(oneMonthEstime => {
              this.dataDurtionEstime.push((oneMonthEstime.durtion/510));
            });

            this.lineChartData = [
              {
                data: this.data,
                label: 'Taux réalisé',
                fill: false
              },
              {
                data: this.dataDurtionEstime,
                label: 'Capacité',
                fill: false
              }];

            this.barChartLabels = [];
            this.bardata = [];
            this.statistics.activityRealisedParMonth.forEach(oneMonth => {
              this.barChartLabels.push(this.months[oneMonth.month - 1] + ' ' + oneMonth.year);
              this.bardata.push(oneMonth.nbreActivityRealised);
            });

            this.barChartData = [
              {
                data: this.bardata,
                label: "Nombre d'"+"activités réalisés"
              }
            ];

            this.optionsbar = {
              title: {
                display: true,
                text: "Nombre d'"+"activités réalisés par mois"
              },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }],
                xAxes: [{
                  ticks: {
                    autoSkip: false
                  }
                }]
              }
            };

          }, err => {
            this.authService.logout();
            this.router.navigateByUrl('/pages/login');
          }
        );
    }
  }

  chercher() {
    this.doSearch();
  }

  doSearch() {

    this.activityService.getActivityToDo(this.motCle, this.currentPage, this.size).subscribe(
      data => {
        this.pageActivities = data;
        this.pages = new Array(data["totalPages"]);
        this.totalElement = data["totalElements"];

      }, err => {
        this.authService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }


  gotoPage(page: number) {
    this.currentPage = page;
    this.doSearch();
  }

  getActivityHoliday() {
    this.activityService.getMyActivityHoliday(this.currentPageHoliday, this.sizeHoliday).subscribe(
      data => {
        this.pageActivitiesHoliday = data;
        this.pagesHoliday = new Array(data["totalPages"]);
        this.totalElementHoliday = data["totalElements"];

      }, err => {
        this.authService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }

  gotoPageHoliday(page: number) {
    this.currentPageHoliday = page;
    this.getActivityHoliday();
  }


  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  onDatesChanged() {
    if (this.activity.dteStrt != null && this.activity.dteEnd != null) {

      if (this.activityService.testDateBeforeNow(this.activity.dteStrt, this.activity.dteEnd) == true) {

        this.activity.statut = true;

      } else {
        this.activity.statut = false;

      }
    }
  }

  detectAbrevi(type: string) {
    switch (type) {
      case "Activité support": {
        return "AS";
      }
      case "Activité projet": {
        return "AP";
      }
      case "Activité recouvrement": {
        return "AR";
      }
      case "Activité congé": {
        return "AC";
      }
      case "Activité commerciale": {
        return "ACM";
      }
      case "Activité SI": {
        return "ASSI";
      }
      case "Activité avant vente": {
        return "AAV";
      }
    }
  }

  selectActivity(activity: any) {
    if (this.activity.typeActivite == 'Activité congé') {
      this.indexSelectedHoliday = this.pageActivitiesHoliday.content.indexOf(activity);
    } else {
      this.indexSelected = this.pageActivities.content.indexOf(activity);
    }

    this.activity = JSON.parse(JSON.stringify(activity));
    var duree = this.activityService.diffBetwenTwoDateInMinutes(this.activity.dteStrt, this.activity.dteEnd);
    this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(duree);
    switch (activity.typeActivite) {
      case "Activité support" : {
        this.activityRequest = JSON.parse(JSON.stringify(activity));
        this.activityRequest.dteStrt = new Date(activity.dteStrt);
        this.activityRequest.dteEnd = new Date(activity.dteEnd);
        this.disabledStatut = !this.activityService.testDateBeforeNow(activity.dteStrt, activity.dteEnd);
        this.editactivityRequestModal.show();
        break;
      }

      case "Activité SI" : {
        this.activitySI = JSON.parse(JSON.stringify(activity));
        this.activitySI.dteStrt = new Date(activity.dteStrt);
        this.activitySI.dteEnd = new Date(activity.dteEnd);
        this.disabledStatut = !this.activityService.testDateBeforeNow(activity.dteStrt, activity.dteEnd);
        this.editactivitySIModal.show();
        break;
      }

      case "Activité commerciale": {
        this.activityCommercial = JSON.parse(JSON.stringify(activity));
        this.activityCommercial.dteStrt = new Date(activity.dteStrt);
        this.activityCommercial.dteEnd = new Date(activity.dteEnd);
        this.disabledStatut = !this.activityService.testDateBeforeNow(activity.dteStrt, activity.dteEnd);
        this.editactivityCommercialModal.show();
        break;
      }

      case "Activité recouvrement": {
        this.activityRecouvrement = JSON.parse(JSON.stringify(activity));
        this.activityRecouvrement.dteStrt = new Date(activity.dteStrt);
        this.activityRecouvrement.dteEnd = new Date(activity.dteEnd);
        this.disabledStatut = !this.activityService.testDateBeforeNow(activity.dteStrt, activity.dteEnd);
        this.editactivityRecouvrementModal.show();
        break;
      }

      case "Activité avant vente": {
        this.activityAvantVente = JSON.parse(JSON.stringify(activity));
        this.activityAvantVente.dteStrt = new Date(activity.dteStrt);
        this.activityAvantVente.dteEnd = new Date(activity.dteEnd);
        this.disabledStatut = !this.activityService.testDateBeforeNow(activity.dteStrt, activity.dteEnd);
        this.editactivityAvantVenteModal.show();
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
          this.authService.logout();
          this.router.navigateByUrl('/pages/login');

        });
    }
  }

}
