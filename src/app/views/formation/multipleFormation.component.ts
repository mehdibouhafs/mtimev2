import {Component, EventEmitter, Host, Inject, OnInit, Output} from '@angular/core';
import {FormationService} from "../../services/formation.service";
import {Formation} from "../../model/model.formation";
import {AuthenticationService} from "../../services/authentification.service";
import {NotificationsService} from "angular2-notifications";

@Component({
  templateUrl: 'multipleFormation.component.html',
})
export class MultipleFormationComponent implements OnInit{

  public childItems: Array<number> = new Array(1);

  @Output() myOutPutValue = new EventEmitter();

  campuses : Array<object> = new Array(6); // initialise the array with an empty object
   addCampus(){
     console.log("teste");
    // push an empty object onto the array
     console.log(this.campuses.length);
    this.campuses.push({});
  }

  ngOnInit(){

  }

  constructor(private formationService:FormationService,private  autehntificationService:AuthenticationService,private notificationService: NotificationsService ) {



  }


  dupliquer(){
    length = this.childItems.length;
    this.childItems.push(length+1);
  }




}
