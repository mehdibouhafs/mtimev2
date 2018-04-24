import {Component, OnInit} from "@angular/core";
import {FormationService} from "../../services/formation.service";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Formation} from "../../model/model.formation";
import {UserService} from "../../services/user.service";
import {User} from "../../model/model.user";

@Component({
  templateUrl: 'editFormation.component.html'
})
export class EditFormationComponent implements  OnInit{
  mode:number=1;
  formation : Formation = new Formation();
  idFormation :number;
  users: any;
  selectedUsers = [];
  link : string = "assets/img/avatars/";

  constructor(private formationService:FormationService, private userService:UserService, private  autehntificationService:AuthenticationService,private activateRoute:ActivatedRoute,private router : Router){

    this.idFormation = this.activateRoute.snapshot.params['id'];
  }

  ngOnInit(){
      this.formationService.getFormation(this.idFormation)
        .subscribe((data:Formation)=>{
          this.formation = data;
          this.selectedUsers = this.formation.participants;
          console.log("formation " + this.formation);
        },err=>{
          console.log(err);
        });
    this.userService.getAllUsers()
      .subscribe(data => {
        this.users = data;
      }, err => {
        console.log(err);
      });

  }

  onEditFormation() {

    this.formation.participants = [];

    this.selectedUsers.forEach(val => {
      this.formation.participants.push(val);
    });

    this.formationService.updateFormation(this.formation)
      .subscribe((data: Formation) => {
        console.log("ok " + data);
        this.formation = data;
        this.mode = 2;
      }), err => {
      console.log(JSON.parse(err.body).message);
    };
  }

  toNewFormation() {
    this.router.navigateByUrl('/formation/nouvelle-formation');
  }

  removeOne(user:User){
    this.selectedUsers =  this.selectedUsers.filter(obj => obj !== user);
    this.selectedUsers.splice(
      this.selectedUsers.indexOf(user), 1
    )
  }

}
