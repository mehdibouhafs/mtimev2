import {ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
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
import {UserService} from "../../services/user.service";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {User} from "../../model/model.user";
import {ActivityAvantVente} from "../../model/model.activityAvantVente";
import {ActivityDevCompetence} from "../../model/model.activityDevCompetence";

@Component({
  templateUrl: 'activity-service.component.html'
})
export class ActivityServiceComponent implements OnInit{

  customers:any;
  projects:any;
  pageActivities: any;
  motCle:string="";
  currentPage : number = 1;
  itemsPerPage : number = 10;
  totalElement:number;
  size : number = 10;
  pages: Array<number>;

  users:any;
  selectedUser:string;
  usersTypeahead = new EventEmitter<string>();

  items = [
    {
      type: "Activité support",
      logo:"fa fa-bullhorn",
      shortType: "AS"
    },
    {
      type: "Activité commerciale",
      logo:"fa fa-shopping-cart",
      shortType: "ACM"
    },
    {
      type: "Activité projet",
      logo:"fa fa-product-hunt",
      shortType: "AP"
    },
    {
      type: "Activité SI",
      logo:"fa fa-support",
      shortType: "ASSI"
    },
    {
      type: "Activité recouvrement",
      logo:"fa fa-briefcase",
      shortType: "AR"
    },
    {
      type: "Activité dev competence",
      logo:"fa fa-briefcase",
      shortType: "ADC"
    },
    {
      type: "Activité congé",
      logo:"fa fa-plane",
      shortType: "AC"
    }
  ];
  typeSelected = [];

  activity : Activity = new Activity();
  activityRequest:ActivityRequest = new ActivityRequest();
  activitySI:ActivitySI = new ActivitySI();
  activityRecouvrement:ActivityRecouvrement = new ActivityRecouvrement();
  activityCommercial:ActivityCommercial = new ActivityCommercial();
  activityProject:ActivityProject = new ActivityProject();
  activityHoliday:ActivityHoliday = new ActivityHoliday();
  activityAvantVente:ActivityAvantVente = new ActivityAvantVente();
  activityDevCompetence:ActivityDevCompetence = new ActivityDevCompetence();


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

  @ViewChild('activityAvantVenteModal')
  activityAvantVenteModal;

  @ViewChild('activityDevCompetenceModal')
  activityDevCompetenceModal;

  constructor(public activityService:ActivityService, private userService: UserService, private  authentificationService:AuthenticationService, private projectService:ProjectService, private customerService:CustomerService, private router:Router, private ref:ChangeDetectorRef) { }

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";

  ngOnInit(){
    if (!this.authentificationService.isLogged())
      this.router.navigate(['/pages/login']);
    else {
      this.doSearch();
      this.serverSideSearch();
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

  detectModal(activity:any) {
    switch (activity.typeActivite) {
      case "Activité commerciale": {
        this.activityCommercial = activity;
        this.activityCommercialModal.show();
        break;
      }

      case "Activité SI": {
        this.activitySI = activity;
        this.activitySIModal.show();
        break;
      }

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

      case "Activité recouvrement": {
        this.activityRecouvrement = activity;
        this.activityRecouvrementModal.show();
        break;
      }

      case "Activité support": {
        this.activityRequest = activity;
        this.activityRequestModal.show();
        break;
      }
      case "Activité avant vente": {
        this.activityAvantVente = activity;
        this.activityAvantVenteModal.show();
        break;
      }
      case "Activité dev competence": {
        this.activityDevCompetence = activity;
        this.activityDevCompetenceModal.show();
        break;
      }

      default: {
        break;
      }
    }
  }

  chercher(){
    this.doSearch();
  }

  doSearch(){

    this.activityService.getActivityByService(this.selectedUser?this.selectedUser:"",this.motCle,this.currentPage,this.size, this.typeSelected).subscribe(
      data=>{
        this.pageActivities = data;
        this.pages = new Array(data["totalPages"]);
        this.totalElement = data["totalElements"];

      },err=>{
        this.authentificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }

  gotoPage(page:number){
    this.currentPage = page;
    this.doSearch();
  }

}
