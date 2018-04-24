import {Component, OnInit} from "@angular/core";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Certification} from "../../model/model.certification";
import {CertificationService} from "../../services/certification.service";
import {UserService} from "../../services/user.service";
import {User} from "../../model/model.user";

@Component({
  templateUrl: 'editCertification.component.html'
})
export class EditCertificationComponent implements OnInit{
  mode:number=1;
  certification : Certification = new Certification();
  idCertification :number;

  users: any;
  selectedUsers = [];
  link : string = "assets/img/avatars/";

  constructor(private certificationService:CertificationService, private userService: UserService ,private  autehntificationService:AuthenticationService,private activateRoute:ActivatedRoute){

    this.idCertification = this.activateRoute.snapshot.params['id'];
    console.log("idCertification" + this.idCertification);
  }

  ngOnInit(){
      this.certificationService.getCertification(this.idCertification)
        .subscribe((data:Certification)=>{
          this.certification = data;
          this.selectedUsers = this.certification.participants;
          console.log("certification " + this.certification);
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

  onEditCertification() {

    this.certification.participants = [];
    this.selectedUsers.forEach(val => {
      this.certification.participants.push(val);
    });

    this.certificationService.updateCertification(this.certification)
      .subscribe((data: Certification) => {
        console.log("ok " + data);
        this.certification = data;
        this.mode = 2;
      }), err => {
      console.log(JSON.parse(err.body).message);
    };
  }

  toModeOne() {
    this.mode = 1;
    this.certification = new Certification();
    this.selectedUsers = [];
  }

  removeOne(user:User){
    this.selectedUsers =  this.selectedUsers.filter(obj => obj !== user);
    this.selectedUsers.splice(
      this.selectedUsers.indexOf(user), 1
    )
  }


}
