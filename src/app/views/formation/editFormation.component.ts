import {Component, OnInit} from "@angular/core";
import {FormationService} from "../../services/formation.service";
import {AuthenticationService} from "../../services/authentification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Formation} from "../../model/model.formation";

@Component({
  templateUrl: 'editFormation.component.html'
})
export class EditFormationComponent implements  OnInit{
  mode:number=1;
  formation : Formation = new Formation();
  idFormation :number;

  constructor(private formationService:FormationService,private  autehntificationService:AuthenticationService,private activateRoute:ActivatedRoute,private router : Router){

    this.idFormation = this.activateRoute.snapshot.params['id'];
  }

  ngOnInit(){
      this.formationService.getFormation(this.idFormation)
        .subscribe((data:Formation)=>{
          this.formation = data;
          console.log("formation " + this.formation);
        },err=>{
          console.log(err);
        });

  }

  onEditFormation() {
    this.formationService.updateFormation(this.formation)
      .subscribe((data: Formation) => {
        console.log("ok " + data);
        this.formation = data;
        this.mode = 2;
      }), err => {
      console.log(JSON.parse(err.body).message);
    };
  }


}
