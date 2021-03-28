import {Component, Input} from "@angular/core";
import {ActivityService} from "../../services/activity.service";
import {AuthenticationService} from "../../services/authentification.service";
import {Router} from "@angular/router";

@Component({
  selector: "activity-by-ticket",
  templateUrl: "activitybyticket.component.html"
})

export class ActivitybyticketComponent {




  motCle:string="";
  currentPage : number = 1;
  itemsPerPage : number = 5;
  size : number = 5;
  @Input() modal:any;
  @Input() pageActivityRequest:any;
  @Input() totalElement:number;
  @Input() pages: Array<number>;
  @Input() rqtExcde:string;

  constructor(private activityService:ActivityService, private authentificationService:AuthenticationService, private router:Router) {

  }

  hideModal() {
    this.modal.hide();
  }

  chercher(){
    this.doSearch();
  }

  doSearch(){

    this.activityService.getActivityRequestByTicket(this.rqtExcde,this.currentPage,this.size).subscribe(
      data=>{
        this.pageActivityRequest = data;
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
