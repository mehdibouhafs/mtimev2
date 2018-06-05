import {ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivityRecouvrement} from "../../model/model.activityRecouvrement";
import {ActivityService} from "../../services/activity.service";
import * as moment from "moment-timezone";
import {CustomerService} from "../../services/customer.service";
@Component({
  selector: 'edit-activity-recouvrement',
  templateUrl: 'editActivityRecouvrement.component.html'
})
export class EditActivityRecouvrementComponent {
  mode:number=1;
  @Input() modal;
  @Input() activityRecouvrement : ActivityRecouvrement = new ActivityRecouvrement();
  @Input() pageActivities: any;
  @Input() index:any;
  @Input() toDo:boolean = false;
  @Input() disabledStatut:boolean = false;

  message : string;
  customers : any;
  currentDate : Date = new Date();
  dureeFormated : string;
  error:number = 0;
  returnedError : string;

  duree: number;
  dureeConverted: string;

  constructor(private activityService:ActivityService, private customerService: CustomerService, private authenticationService:AuthenticationService, private router:Router, private activateRoute:ActivatedRoute, private ref:ChangeDetectorRef){



  }

  hideModal() {
    this.modal.hide();
  }

  onEditActivityRecouvrement() {
    this.activityRecouvrement.updatedAt = new Date();
    this.activityRecouvrement.hrStrt = moment(this.activityRecouvrement.dteStrt).format("HH:mm");
    this.activityRecouvrement.hrEnd =  moment(this.activityRecouvrement.dteEnd).format("HH:mm");
    this.activityRecouvrement.durtion =  this.activityService.diffBetwenTwoDateInMinutes(this.activityRecouvrement.dteStrt,this.activityRecouvrement.dteEnd);
    this.activityService.updateActivity(this.activityRecouvrement)
      .subscribe((data: ActivityRecouvrement) => {
        this.pageActivities.content.splice(this.index, 1, this.activityRecouvrement);
        this.mode = 2;
        this.ref.detectChanges();
      }), err => {
      console.log(JSON.parse(err.body).message);
    };
  }

  onDatesChanged(){
    console.log("onDatesChanged ");
    if(this.activityRecouvrement.dteStrt != null && this.activityRecouvrement.dteEnd !=null){
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activityRecouvrement.dteStrt, this.activityRecouvrement.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activityRecouvrement.dteStrt,this.activityRecouvrement.dteEnd) == true ){

        this.activityRecouvrement.statut = true;
        this.disabledStatut = false;

      }else{
        this.activityRecouvrement.statut = false;
        this.disabledStatut = true;

      }
    }
  }



  loadCustomers(){
    this.customerService.getCustomers().subscribe(
      data=>{
        this.customers = data["_embedded"]["customers"];
        console.log("customers " + JSON.stringify(this.customers));
      },err=>{
        this.authenticationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }



}
