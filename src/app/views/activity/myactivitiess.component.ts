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

@Component({
  templateUrl: 'myactivitiess.component.html'
})
export class MyActivitiessComponent implements OnInit{
  pageActivities: any;
  motCle:string="";
  currentPage : number = 1;
  itemsPerPage : number = 5;
  totalElement:number;
  size : number = 5;
  pages: Array<number>;

  indexSelected:any;
  items = [
    {
      type: "Activité support",
      shortType: "AS"
    },
    {
      type: "Activité commerciale",
      shortType: "ACM"
    },
    {
      type: "Activité projet",
      shortType: "AP"
    },
    {
      type: "Activité SI",
      shortType: "ASSI"
    },
    {
      type: "Activité recouvrement",
      shortType: "AR"
    },
    {
      type: "Activité congé",
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

  constructor(public activityService:ActivityService,private  autehntificationService:AuthenticationService,private router:Router ) { }

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";

  ngOnInit(){
    this.doSearch();

  }

  detectModal(activity:any) {
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
      default: {
        break;
      }
    }
  }

  chercher(){
    this.doSearch();
  }

  doSearch(){
    console.log("motCle " + this.motCle);
    console.log(this.typeSelected);

    this.activityService.getMyActivitiesByMc(this.motCle,this.currentPage,this.size,this.typeSelected).subscribe(
      data=>{
        this.pageActivities = data;
        this.pages = new Array(data["totalPages"]);
        this.totalElement = data["totalElements"];

      },err=>{
        this.autehntificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }

  selectActivity(activity : any){
    this.indexSelected = this.pageActivities.content.indexOf(activity);
    this.activity = JSON.parse(JSON.stringify(activity));
    switch (activity.typeActivite) {
      case "Activité support" : {
        this.activityRequest = JSON.parse(JSON.stringify(activity));
        this.activityRequest.dteStrt = new Date(activity.dteStrt);
        this.activityRequest.dteEnd = new Date(activity.dteEnd);
        break;
      }

      case "Activité SI" : {
        this.activitySI = JSON.parse(JSON.stringify(activity));
        this.activitySI.dteStrt = new Date(activity.dteStrt);
        this.activitySI.dteEnd = new Date(activity.dteEnd);
        break;
      }

      case "Activité commerciale": {
        this.activityCommercial = JSON.parse(JSON.stringify(activity));
        this.activityCommercial.dteStrt = new Date(activity.dteStrt);
        this.activityCommercial.dteEnd = new Date(activity.dteEnd);
        break;
      }

      case "Activité recouvrement": {
        this.activityRecouvrement = JSON.parse(JSON.stringify(activity));
        this.activityRecouvrement.dteStrt = new Date(activity.dteStrt);
        this.activityRecouvrement.dteEnd = new Date(activity.dteEnd);
        break;
      }

      case "Activité projet": {
        this.activityProject = JSON.parse(JSON.stringify(activity));
        this.activityProject.dteStrt = new Date(activity.dteStrt);
        this.activityProject.dteEnd = new Date(activity.dteEnd);
        break;
      }

      case "Activité congé": {

        this.activityHoliday = JSON.parse(JSON.stringify(activity));
        this.activityHoliday.dteStrt = new Date(activity.dteStrt);
        this.activityHoliday.dteEnd = new Date(activity.dteEnd);
        break;
      }

      default : {
        break;
      }
    }
  }


  gotoPage(page:number){
    this.currentPage = page;
    this.doSearch();
  }

  onEditMyActivity(activity:Activity){

    this.selectActivity(activity);
    switch(activity.typeActivite) {
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
    }

  }

  onDeleteMyActivity(activity:Activity){

    this.activityService.deleteActivity(activity.id)
      .subscribe(data => {
        this.pageActivities.content.splice(
          this.indexSelected, 1
        )
      }, err => {
        console.log("err");
      });

  }

}
