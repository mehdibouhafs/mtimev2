import {ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivityRequest} from "../../model/model.activityRequest";
import {ActivityService} from "../../services/activity.service";
import * as moment from "moment-timezone";
import {Request} from "../../model/model.request";
import {Activity} from "../../model/model.activity";
import {RequestService} from "../../services/request.service";
import {CustomerService} from "../../services/customer.service";
@Component({
  selector: 'edit-activity-request',
  templateUrl: 'editActivityRequest.component.html'
})
export class EditActivityRequestComponent implements OnInit {

  mode:number=1;
  @Input() modal;
  @Input() activityRequest : ActivityRequest = new ActivityRequest();
  @Input() pageActivities: any;
  @Input() index:any;
  @Input() toDo:boolean = false;
  @Input() disabledStatut:boolean = false;

  message: string;
  customers: any;
  currentDate: Date = new Date();
  dureeFormated: string;
  error: number = 0;
  returnedError: string;
  requestOk: boolean;

  duree: number;
  dureeConverted: string;

  constructor(private activityService:ActivityService, private customerService:CustomerService, private requestService: RequestService, private  authenticationService:AuthenticationService, private router:Router,private activateRoute:ActivatedRoute, private ref:ChangeDetectorRef){

  }

  ngOnInit() {
    this.requestOk = true;
    this.loadCustomers();
  }


  hideModal() {
    this.modal.hide();
  }

  onEditActivityRequest() {
    this.activityRequest.updatedAt = new Date();
    this.activityRequest.hrStrt = moment(this.activityRequest.dteStrt).format("HH:mm");
    this.activityRequest.hrEnd = moment(this.activityRequest.dteEnd).format("HH:mm");
    this.activityRequest.durtion = this.activityService.diffBetwenTwoDateInMinutes(this.activityRequest.dteStrt, this.activityRequest.dteEnd);
    this.activityService.updateActivity(this.activityRequest)
      .subscribe((data: ActivityRequest) => {
        this.pageActivities.content.splice(this.index, 1, this.activityRequest);
        this.mode = 2;
        this.ref.detectChanges();
      }), err => {
      console.log(JSON.parse(err.body).message);
    };
  }


  onDatesChanged() {
    console.log("onDatesChanged ");
    if (this.activityRequest.dteStrt != null && this.activityRequest.dteEnd != null) {
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activityRequest.dteStrt, this.activityRequest.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activityRequest.dteStrt, this.activityRequest.dteEnd) == true) {

        this.activityRequest.statut = true;
        this.disabledStatut = false;

      } else {
        this.activityRequest.statut = false;
        this.disabledStatut = true;

      }
    }
  }


  loadCustomers() {
    this.customerService.getCustomers().subscribe(
      data => {
        this.customers = data["_embedded"]["customers"];
        console.log("customers " + JSON.stringify(this.customers));
      }, err => {
        this.authenticationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }

  onSearchRequest($event) {

    if (this.activityRequest.request.rqtExcde.length == 10) {
      this.requestService.getRequest(this.activityRequest.request.rqtExcde).subscribe(
        (data: Request) => {
          console.log("Request " + JSON.stringify(data));
          this.activityRequest.request = data;
          this.requestOk = true;
          //console.log("projects customer " + JSON.stringify(this.projects));
        }, err => {
          // this.authenticationService.logout();
          //this.router.navigateByUrl('/pages/login');
          this.requestOk = false;
          console.log(err);
        });
    }

    else this.requestOk = false;

  }


}
