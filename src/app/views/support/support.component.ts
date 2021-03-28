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
import {CustomerService} from "../../services/customer.service";

@Component({
  templateUrl: 'support.component.html'
})
export class SupportComponent implements OnInit{

  customers:any;
  pageActivities: any;
  motCle:string="";
  currentPage : number = 1;
  itemsPerPage : number = 5;
  totalElement:number;
  size : number = 5;
  pages: Array<number>;

  @ViewChild('activityRequestModal')
  activityRequestModal;

  pageActivityRequest: any;
  pagesActivityRequest: Array<number>;
  totalElementActivityRequest:number;
  rqtExcde:string;
  @ViewChild('activityByTicket')
  activityByTicket;
  lastActivity :any;
  activityRequest:ActivityRequest = new ActivityRequest();
  activity:ActivityRequest = new ActivityRequest();


  constructor(private requestService: RequestService, private activityService:ActivityService, private  authentificationService:AuthenticationService, private customerService:CustomerService,private router:Router ) { }

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";

  ngOnInit(){
    if(!this.authentificationService.isLogged())
      this.router.navigate(['/pages/login']);
    else {
      this.doSearch();
      this.loadCustomers();
      this.activityService.getLastActivity().subscribe(
        data => {
          this.lastActivity = data;
        }, err => {
          console.log(err);
        }
      );
    }
  }

  addActivity(r:any) {
    this.activity.user.username = this.authentificationService.getUserName();
    this.activity.typeActivite = "Activité support";
    this.activity.dteStrt = new Date();
    this.activity.request = r;
    this.activity.customer = r.cpyInCde;
    this.activityRequest = JSON.parse(JSON.stringify(this.activity));
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
        this.authentificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }


  gotoPage(page:number){
    this.currentPage = page;
    this.doSearch();
  }

  loadCustomers(){
    this.customerService.getCustomers().subscribe(
      data=>{
        this.customers = data["_embedded"]["customers"];
        console.log("customers " + JSON.stringify(this.customers));
      },err=>{
        this.authentificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }

  chargerModalActivity(rqtExcde:string) {
    this.rqtExcde = rqtExcde;
    this.activityService.getActivityRequestByTicket(rqtExcde,1,5).subscribe(
      data=>{
        this.pageActivityRequest = data;
        this.pagesActivityRequest = new Array(data["totalPages"]);
        this.totalElementActivityRequest = data["totalElements"];

      },err=>{
        this.authentificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
    this.activityByTicket.show();
  }



}
