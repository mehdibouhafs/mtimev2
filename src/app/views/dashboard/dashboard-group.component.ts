import {ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
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
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {UserService} from "../../services/user.service";

@Component({
  templateUrl: 'dashboard-group.component.html'
})
export class DashboardGroupComponent implements OnInit {

  users: any;
  selectedUser: string;
  usersTypeahead = new EventEmitter<string>();

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

  constructor(public authService: AuthenticationService, private dashboardService: DashboardService, private projectService: ProjectService, private customerService: CustomerService, private activityService: ActivityService, private userService: UserService, private router: Router, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    if(!this.authService.isLogged())
      this.router.navigate(['/pages/login']);
    else {

      this.authService.getTasks()
        .subscribe(data => {
          this.tasks = data;
        }, err => {
          this.authService.logout();
          this.router.navigateByUrl('/pages/login');
        });

      this.serverSideSearch();

      this.getActivityHoliday();

      this.getStatistics()
        .subscribe(data => {
            this.statistics = data;

            this.options = {
              title: {
                display: true,
                text: 'Pourcentage pour chaque Type d activité réalisé'
              }
            };
            this.options1 = {
              title: {
                display: true,
                text: 'Nombre d activités pour chaque client'
              }
            };

            this.optionsLine = {
              title: {
                display: true,
                text: 'Taux de productivité par rapport à la capacité'
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
              this.pieChartData.push((oneType.nbre * 100) / this.statistics.realisedActivities);
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
              this.data.push((oneMonth.durtion / 510).toFixed(1));
            });

            this.dataDurtionEstime = [];
            this.statistics.durtionEstimeParMonth.forEach(oneMonthEstime => {
              this.dataDurtionEstime.push((oneMonthEstime.durtion / 510));
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
                label: 'Nombre d activités réalisés'
              }
            ];

            this.optionsbar = {
              title: {
                display: true,
                text: 'Nombre d activités réalisés pour chaque mois'
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

  getStatistics() {
    if (this.selectedUser)
      return this.dashboardService.getStatisticsForUser(this.selectedUser);
    return this.dashboardService.getStatistics();
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

  getActivityHoliday() {
    if (this.selectedUser) {
      this.activityService.getActivityHolidayForUser(this.selectedUser, this.currentPageHoliday, this.sizeHoliday).subscribe(
        data => {
          this.pageActivitiesHoliday = data;
          this.pagesHoliday = new Array(data["totalPages"]);
          this.totalElementHoliday = data["totalElements"];

        }, err => {
          this.authService.logout();
          this.router.navigateByUrl('/pages/login');
        });
    } else {
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
    }
  }

}
