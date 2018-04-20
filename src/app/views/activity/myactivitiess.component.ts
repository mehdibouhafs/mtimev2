import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router";
import {Activity} from "../../model/model.activity";
import {ActivityService} from "../../services/activity.service";

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

  public popoverTitle: string = 'Suppression de la activité';
  public popoverMessage: string = "<b>Est vous sure de vouloir supprimer cette activité </b>";
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  activity : Activity = new Activity();

  constructor(private activityService:ActivityService,private  autehntificationService:AuthenticationService,private router:Router ) { }

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";

  ngOnInit(){
    this.doSearch();
  }

  chercher(){
    this.doSearch();
  }

  doSearch(){
    console.log("motCle " + this.motCle);

    this.activityService.getMyActivitiesByMc(this.motCle,this.currentPage,this.size).subscribe(
      data=>{
        this.pageActivities = data;
        this.pages = new Array(data["totalPages"]);
        this.totalElement = data["totalElements"];

      },err=>{
        this.autehntificationService.logout();
        this.router.navigateByUrl('/pages/login');
      });
  }

  selectActivity(activity : Activity){
    console.log("selected");
    this.activity = activity;
  }


  gotoPage(page:number){
    this.currentPage = page;
    this.doSearch();
  }

  onEditMyActivity(activity:Activity){

    switch(activity.typeActivite) {
      case "Activité projet": {
        this.router.navigate(["/activityProject/edit-activity-project/",activity.id]);
        break;
      }
      case "Activité recouvrement": {
        //statements;
        break;
      }
      default: {
        //statements;
        break;
      }
    }


    //this.router.navigateByUrl('/formation/edit-formation/'+id);
  }

  onDeleteMyActivity(activity:Activity){

    this.activityService.deleteActivity(activity.id)
      .subscribe(data => {
        this.pageActivities.content.splice(
          this.pageActivities.content.indexOf(activity), 1
        )
      }, err => {
        console.log("err");
      });

  }

  onShowMyActivity(activity:Activity){

    switch(activity.typeActivite) {
      case "Activité projet": {
        this.router.navigate(["/activityProject/show-activity-project/",activity.id]);
        break;
      }
      case "Activité recouvrement": {
        //statements;
        break;
      }
      default: {
        //statements;
        break;
      }
    }

  }


}
