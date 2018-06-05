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
import {RequestService} from "../../services/request.service";

@Component({
  templateUrl: 'support.component.html'
})
export class SupportComponent implements OnInit{
  pageActivities: any;
  motCle:string="";
  currentPage : number = 1;
  itemsPerPage : number = 5;
  totalElement:number;
  size : number = 5;
  pages: Array<number>;

  @ViewChild('activityRequestModal')
  activityRequestModal;
  activityRequest:ActivityRequest = new ActivityRequest();


  constructor(private requestService: RequestService,private  autehntificationService:AuthenticationService,private router:Router ) { }

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";

  ngOnInit(){
    this.doSearch();

  }

  addActivity(r:any) {
    this.activityRequest.request = JSON.parse(JSON.stringify(r));
    this.activityRequest.customer = JSON.parse(JSON.stringify(r.cpyInCde));
    this.activityRequestModal.show();
  }


  chercher(){
    this.doSearch();
  }

  doSearch(){
    console.log("motCle " + this.motCle);

    this.requestService.getMyRequests(this.motCle,this.currentPage,this.size).subscribe(
      data=>{
        this.pageActivities = data;
        this.pages = new Array(data["totalPages"]);
        this.totalElement = data["totalElements"];

      },err=>{
        this.autehntificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }


  gotoPage(page:number){
    this.currentPage = page;
    this.doSearch();
  }



}
