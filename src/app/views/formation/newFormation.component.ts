import {Component, EventEmitter, Host, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {FormationService} from "../../services/formation.service";
import {Formation} from "../../model/model.formation";
import {AuthenticationService} from "../../services/authentification.service";
import {NotificationsService} from "angular2-notifications";

@Component({
  selector:"app-new-formation",
  templateUrl: 'newFormation.component.html',
})
export class NewFormationComponent implements OnInit{

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  formation : Formation = new Formation();
  frmName:any;
  mode:number=1;
  //appHeaderComponent: AppHeaderComponent;
  message : string;


  campuses : Array<object> = new Array(6); // initialise the array with an empty object
   addCampus(){
     console.log("teste");
    // push an empty object onto the array
     console.log(this.campuses.length);
    this.campuses.push({});
  }

  constructor(private formationService:FormationService,private  autehntificationService:AuthenticationService,private notificationService: NotificationsService) {

  }

  public options = {
    position: ["bottom", "right"],
    timeOut: 30000,
    lastOnBottom: false,
    maxStack:7,
  }

  created(event){
    console.log("event " + JSON.stringify(event));
  }

  destroyed(event){
    console.log("destroyed " + event);
  }

  ngOnInit(){
  }



  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? "icon-arrow-down" : "icon-arrow-up";
  }

  onSaveFormation(){

      this.formationService.saveFormation(this.formation)
        .subscribe((data :Formation)=>{
          this.formation = data;
          this.mode=2;
          const toast= this.notificationService.success("Confirmation d'ajout", "Formation ajouté avec succès", {
            timeOut: 7000,
            showProgressBar: false,
            pauseOnHover: true,
            clickToClose: false,
            clickIconToClose: true});
          //this.appHeaderComponent = new AppHeaderComponent(null,null,this.notificationService);
          //this.appHeaderComponent.lunchSuccessFunction(this.notificationService);

          toast.clickIcon.subscribe((event) => {
            console.log("test");
          });
        }),err=>{
        console.log(JSON.parse(err.body).message);
      }
  }





}
