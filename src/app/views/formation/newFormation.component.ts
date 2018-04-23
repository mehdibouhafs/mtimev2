import {Component, EventEmitter, Host, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {FormationService} from "../../services/formation.service";
import {Formation} from "../../model/model.formation";
import {AuthenticationService} from "../../services/authentification.service";
import {NotificationsService} from "angular2-notifications";
import {User} from "../../model/model.user";
import {UserService} from "../../services/user.service";
import {forEach} from "@angular/router/src/utils/collection";

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
  users: any;
  selectedUsers = [];
  link : string = "assets/img/avatars/";


  campuses : Array<object> = new Array(6); // initialise the array with an empty object
   addCampus(){
     console.log("teste");
    // push an empty object onto the array
     console.log(this.campuses.length);
    this.campuses.push({});
  }

  constructor(private formationService:FormationService, private userService:UserService , private  autehntificationService:AuthenticationService,private notificationService: NotificationsService) {

  }

  removeOne(user:User){
    this.selectedUsers = this.selectedUsers.filter(obj => obj !== user);
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
     this.userService.getAllUsers()
       .subscribe(data => {
         this.users = data;
       }, err => {
         console.log(err);
       });
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

  toModeOne() {
    this.mode = 1;
    this.formation = new Formation();
    this.selectedUsers = [];
  }

  onSaveFormation(){


     this.selectedUsers.forEach(val => {
       this.formation.participants.push(val);
     });

     console.log(JSON.stringify(this.formation));

      this.formationService.saveFormation(this.formation)
        .subscribe((data :Formation)=>{
          console.log(data);
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

          //toast.clickIcon.subscribe((event) => {
          //  console.log("test");
          //});
        },err=>{
          console.log(JSON.parse(err.body).message);
        });
  }





}
