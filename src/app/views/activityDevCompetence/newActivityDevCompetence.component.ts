import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthenticationService} from "../../services/authentification.service";
import {NotificationsService} from "angular2-notifications";
import {SocketService} from "../../services/socket.service";
import {Client, Frame, Message} from "stompjs";
import {Subject} from "rxjs/Subject";
import {ActivityProject} from "../../model/model.activityProject";
import {ActivityService} from "../../services/activity.service";
import {CustomerService} from "../../services/customer.service";
import {Customer} from "../../model/model.customer";
import {Router} from "@angular/router";
import {ProjectService} from "../../services/project.service";
import {DateTimeAdapter} from "ng-pick-datetime";
import * as moment from "moment-timezone";
import {Project} from "../../model/model.project";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {VilleService} from "../../services/ville.service";
import {ProduitService} from "../../services/produit.service";
import {NatureService} from "../../services/nature.service";
import {ActivityDevCompetence} from "../../model/model.activityDevCompetence";


@Component({
  selector: "new-activityDevCompetence",
  templateUrl: 'newActivityDevCompetence.component.html',
})
export class NewActivityDevCompetenceComponent implements OnInit, OnDestroy {

  @Input() modal;
  @Input() lastActivity;

  @Output() refresh = new EventEmitter<string>();

  customers: any;
  ville: any;
  produits: any;

  isCollapsed: boolean = false;
  iconCollapse: string = "icon-arrow-up";
  @Input() activityDevCompetence: ActivityDevCompetence= new ActivityDevCompetence();
  frmName: any;
  mode: number = 1;
  message: string;
  projects: any;
  currentDate: Date = new Date();
  disabledStatut: boolean = false;
  dureeFormated: string;
  error: number = 0;
  returnedError: string;

  duree: number;
  dureeConverted: string;

  customerTypeahead = new EventEmitter<string>();

  public role = [
    {
      name: "Principal",
      val: true
    },
    {
      name: "Secondaire",
      val: false
    }
  ];

  public nature:any;

  public lieu = [
    {
      name: "A distance"
    },
    {
      name: "Présentiel"
    }

  ];

  continuer:boolean=false;
  maxDate : Date=new Date();

  constructor(private natureService:NatureService, private produitService: ProduitService, private villeService: VilleService, private activityService: ActivityService, private notificationService: NotificationsService,
              private socketService: SocketService, private customerService: CustomerService, private router: Router,
              private authenticationService: AuthenticationService, private projectService: ProjectService, private ref: ChangeDetectorRef) {
  }

  refreshActivity() {
    this.refresh.emit("Refresh Activity");
  }

  hideModal() {
    this.modal.hide();
  }

  toModeDupliquer() {
    this.mode = 1;
    this.activityDevCompetence.id = null;
    this.activityDevCompetence.dteStrt = null;
    this.duree = null;
    this.dureeConverted = null;
    this.continuer=false;
  }

  toModeOne() {
    this.mode = 1;
    this.error = 0;
    this.activityDevCompetence = new ActivityDevCompetence();
    this.activityDevCompetence.user.username = this.authenticationService.getUserName();
    this.activityDevCompetence.dteStrt = null;
    this.activityDevCompetence.statut = true;
    this.activityDevCompetence.typeActivite = "Activité dev competence";
    this.duree = null;
    this.dureeConverted = null;
    this.continuer=false;
  }


  ngOnDestroy() {

  }

  onTestSocket() {

  }

  ngOnInit() {
    this.activityDevCompetence.user.username = this.authenticationService.getUserName();
    this.activityDevCompetence.dteStrt = null;
    this.activityDevCompetence.statut = true;
    this.activityDevCompetence.typeActivite = "Activité dev competence";
    this.serverSideSearch();
    this.chargerVilles();
    this.chargerProduits();
    this.chargerNatures();
    this.continuer=false;
  }

  chargerNatures() {
    this.natureService.getNatureParType("Activity_dev_competence").subscribe(
      data=>{
        this.nature = data["_embedded"]["nature"];
      }, err=>{
        console.log(err);
      }
    );
  }

  chargerVilles() {
    this.villeService.getAllVilles().subscribe(
      data => {
        this.ville = data["_embedded"]["villes"];
      }
    );
  }

  chargerProduits() {
    this.produitService.getProduits().subscribe(
      data => {
        this.produits = data["_embedded"]["produits"];
      }
    );
  }

  private serverSideSearch() {
    this.customerTypeahead.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      switchMap(term => this.customerService.searchCustomer(term))
    ).subscribe(x => {
      this.ref.markForCheck();
      this.customers = x["_embedded"]["customers"];
    }, (err) => {
      console.log(err);
      this.customers = [];
    });
  }


  onDatesChanged() {
    console.log("onDatesChanged ");
    if (this.activityDevCompetence.dteStrt != null && this.activityDevCompetence.dteEnd != null) {
      this.duree = this.activityService.diffBetwenTwoDateInMinutes(this.activityDevCompetence.dteStrt, this.activityDevCompetence.dteEnd);
      this.dureeConverted = this.activityService.convertMinutesToHoursAndMinute(this.duree);
      if (this.activityService.testDateBeforeNow(this.activityDevCompetence.dteStrt, this.activityDevCompetence.dteEnd) == true) {

        this.activityDevCompetence.statut = true;

      } else {
        this.activityDevCompetence.statut = false;
      }
    }
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

  onSaveActivityAvantVente() {
    if(!this.continuer){
    this.activityDevCompetence.createdAt = new Date();
    this.activityDevCompetence.updatedAt = new Date();

    var hours =  Number(this.activityDevCompetence.duration.split(":")[0]);
    var minutes = Number(this.activityDevCompetence.duration.split(":")[1]);
    this.activityDevCompetence.user.username = this.authenticationService.getUserName();
    this.activityDevCompetence.durtion = Number(hours*60) + Number(minutes);

    this.activityDevCompetence.dteEnd=moment(this.activityDevCompetence.dteStrt).add(hours,'hours').add( minutes,"minutes").toDate();
    this.dureeFormated = this.activityService.diffBetwenTwoDateFormated(this.activityDevCompetence.dteStrt, this.activityDevCompetence.dteEnd);
    this.activityDevCompetence.hrStrt = moment(this.activityDevCompetence.dteStrt).format("HH:mm");
    this.activityDevCompetence.hrEnd = moment(this.activityDevCompetence.dteEnd).format("HH:mm");

    this.activityService.saveActivity(this.activityDevCompetence)
      .subscribe((data: ActivityDevCompetence) => {
        this.activityDevCompetence = data;
        this.activityDevCompetence.typeActivite = "Activité dev competence";
        this.activityDevCompetence.user.username = this.authenticationService.getUserName();
        this.mode = 2;
        this.refreshActivity();
        this.ref.detectChanges();
      }, (err: any) => {
        console.log("error " + JSON.stringify(err));
        this.returnedError = err.error.message;
        this.error = 1;
        this.ref.detectChanges();

      });
    }else{
      this.activityDevCompetence.createdAt = new Date();
      this.activityDevCompetence.updatedAt = new Date();

      var hours =  Number(this.activityDevCompetence.duration.split(":")[0]);
      var minutes = Number(this.activityDevCompetence.duration.split(":")[1]);

      this.activityDevCompetence.durtion = Number(hours*60) + Number(minutes);

      this.activityDevCompetence.dteEnd=moment(this.activityDevCompetence.dteStrt).add(hours,'hours').add( minutes,"minutes").toDate();
      this.dureeFormated = this.activityService.diffBetwenTwoDateFormated(this.activityDevCompetence.dteStrt, this.activityDevCompetence.dteEnd);
      this.activityDevCompetence.hrStrt = moment(this.activityDevCompetence.dteStrt).format("HH:mm");
      this.activityDevCompetence.hrEnd = moment(this.activityDevCompetence.dteEnd).format("HH:mm");
      console.log("duration " + this.activityDevCompetence.durtion);
      this.activityService.saveActivity(this.activityDevCompetence)
        .subscribe((data: ActivityDevCompetence) => {
          console.log("ok resp " + JSON.stringify(data));
          let lastActivityCompetence = this.activityDevCompetence;
          this.activityDevCompetence = new ActivityDevCompetence();
          this.activityDevCompetence.dteStrt=lastActivityCompetence.dteStrt;
          this.activityDevCompetence.typeActivite = "Activité dev competence";
          this.activityDevCompetence.user.username = this.authenticationService.getUserName();
          this.continuer=false;
          this.refreshActivity();
          this.ref.detectChanges();
        }, (err: any) => {
          console.log("error " + JSON.stringify(err));
          this.returnedError = err.error.message;
          this.error = 1;
          this.ref.detectChanges();

        });
    }
  }

  enregisterContinuer(){
    this.continuer=true;

  }

  reject(){
    if(this.activityDevCompetence.duration==="00:00"){
      this.activityDevCompetence.duration=null;
    }
  }


}
